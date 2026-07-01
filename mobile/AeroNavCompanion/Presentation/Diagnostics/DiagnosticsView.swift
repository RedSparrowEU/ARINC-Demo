import SwiftUI

@MainActor final class DiagnosticsViewModel: ObservableObject {
    enum State {
        case idle, loading
        case loaded(DiagnosticsReport)
        case failure(String)
    }
    @Published var state: State = .idle
    let importer: any DiagnosticsImporting
    init(importer: any DiagnosticsImporting = DiagnosticsImportService()) {
        self.importer = importer
    }
    func load(_ url: URL) async {
        state = .loading
        do { state = .loaded(try await importer.load(from: url)) } catch {
            state = .failure(error.localizedDescription)
        }
    }
    func groups(_ report: DiagnosticsReport) -> [(
        String, [DiagnosticsReport.Issue]
    )] {
        ["blocking", "error", "warning", "info"].compactMap { severity in
            let values = report.issues.filter { $0.severity == severity }
            return values.isEmpty ? nil : (severity, values)
        }
    }
}
struct DiagnosticsView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject var viewModel = DiagnosticsViewModel()
    @State private var importing = false
    var body: some View {
        NavigationStack {
            Group {
                switch viewModel.state {
                case .idle:
                    ContentUnavailableView(
                        "No diagnostics report",
                        systemImage: "stethoscope"
                    )
                case .loading: ProgressView()
                case .failure(let message):
                    ContentUnavailableView(
                        "Invalid report",
                        systemImage: "exclamationmark.triangle",
                        description: Text(message)
                    )
                case .loaded(let report):
                    List {
                        Section("Report") {
                            Text(report.package.packageId)
                            Text(
                                "\(report.operation.type) · \(report.operation.status)"
                            )
                        }
                        ForEach(viewModel.groups(report), id: \.0) { group in
                            Section(group.0.capitalized) {
                                ForEach(group.1) { issue in
                                    VStack(alignment: .leading) {
                                        Text(issue.message)
                                        Text(issue.suggestedAction).font(
                                            .caption
                                        ).foregroundStyle(.secondary)
                                    }
                                }
                            }
                        }
                    }
                }
            }.navigationTitle("Diagnostics").toolbar {
                ToolbarItemGroup(placement: .topBarTrailing) {
                    Button("Import", systemImage: "square.and.arrow.down") {
                        importing = true
                    }
                    Button("Close", systemImage: "xmark") { dismiss() }
                        .buttonStyle(.bordered).buttonBorderShape(.circle)
                }
            }.fileImporter(
                isPresented: $importing,
                allowedContentTypes: [.json]
            ) { result in
                if case .success(let url) = result {
                    Task { await viewModel.load(url) }
                }
            }
        }
    }
}
