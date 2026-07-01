import SwiftUI
import VisionKit

struct CompactDiagnosticsSummary: Codable, Equatable, Sendable {
    let packageId, status, generatedAt, summary: String
    let blocking, warning: Int
}
enum CompactSummaryCodec {
    static let prefix = "AERONAV1:"
    static func decode(_ text: String) throws -> CompactDiagnosticsSummary {
        guard text.hasPrefix(prefix) else {
            throw CocoaError(.fileReadCorruptFile)
        }
        var value = String(text.dropFirst(prefix.count)).replacingOccurrences(
            of: "-",
            with: "+"
        ).replacingOccurrences(of: "_", with: "/")
        value += String(repeating: "=", count: (4 - value.count % 4) % 4)
        guard let data = Data(base64Encoded: value) else {
            throw CocoaError(.fileReadCorruptFile)
        }
        return try JSONDecoder().decode(
            CompactDiagnosticsSummary.self,
            from: data
        )
    }
}
@MainActor final class CompanionBridgeViewModel: ObservableObject {
    @Published var text = ""
    @Published var summary: CompactDiagnosticsSummary?
    @Published var error: String?
    func read(_ value: String? = nil) {
        do {
            summary = try CompactSummaryCodec.decode(value ?? text)
            error = nil
        } catch {
            summary = nil
            self.error = "Invalid or unsupported compact diagnostics summary."
        }
    }
    func acceptScannedValue(_ value: String) {
        text = value
        read(value)
    }
}
struct CompanionBridgeView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject var viewModel = CompanionBridgeViewModel()
    @State private var scanning = false
    private var scannerAvailable: Bool {
        DataScannerViewController.isSupported
            && DataScannerViewController.isAvailable
    }
    var body: some View {
        NavigationStack {
            Form {
                Section("Optional text bridge") {
                    TextField(
                        "AERONAV1:…",
                        text: $viewModel.text,
                        axis: .vertical
                    )
                    Button("Read summary") { viewModel.read() }
                    Button("Scan QR code", systemImage: "qrcode.viewfinder") {
                        scanning = true
                    }.disabled(!scannerAvailable)
                    if !scannerAvailable {
                        Text(
                            "QR scanning requires a supported physical device with camera access."
                        ).font(.caption).foregroundStyle(.secondary)
                    }
                }
                if let summary = viewModel.summary {
                    Section("Summary") {
                        LabeledContent("Package", value: summary.packageId)
                        LabeledContent("Status", value: summary.status)
                        LabeledContent("Blocking", value: "\(summary.blocking)")
                        LabeledContent("Warnings", value: "\(summary.warning)")
                        Text(summary.summary)
                    }
                }
                if let error = viewModel.error {
                    Section { Text(error).foregroundStyle(.red) }
                }
                Section {
                    Text(
                        "NON-OPERATIONAL DEMO — compact summaries do not replace the full diagnostics report."
                    ).font(.caption)
                }
            }.navigationTitle("Companion Bridge").toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Close", systemImage: "xmark") { dismiss() }
                        .buttonStyle(.bordered).buttonBorderShape(.circle)
                }
            }.sheet(isPresented: $scanning) {
                QRScanner { value in
                    viewModel.acceptScannedValue(value)
                    scanning = false
                }
            }
        }
    }
}
struct QRScanner: UIViewControllerRepresentable {
    let found: (String) -> Void
    func makeCoordinator() -> Coordinator { Coordinator(found) }
    func makeUIViewController(context: Context) -> DataScannerViewController {
        let controller = DataScannerViewController(recognizedDataTypes: [
            .barcode(symbologies: [.qr])
        ])
        controller.delegate = context.coordinator
        try? controller.startScanning()
        return controller
    }
    func updateUIViewController(
        _ uiViewController: DataScannerViewController,
        context: Context
    ) {}
    final class Coordinator: NSObject, DataScannerViewControllerDelegate {
        let found: (String) -> Void
        private var accepted = false
        init(_ found: @escaping (String) -> Void) { self.found = found }
        func dataScanner(
            _ dataScanner: DataScannerViewController,
            didAdd addedItems: [RecognizedItem],
            allItems: [RecognizedItem]
        ) {
            guard !accepted else { return }
            for item in addedItems {
                if case .barcode(let code) = item,
                    let value = code.payloadStringValue
                {
                    accepted = true
                    dataScanner.stopScanning()
                    found(value)
                    return
                }
            }
        }
    }
}
