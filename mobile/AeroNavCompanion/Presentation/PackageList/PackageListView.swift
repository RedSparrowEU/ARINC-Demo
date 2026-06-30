import SwiftUI

struct PackageListView: View {
    @StateObject private var viewModel: PackageListViewModel

    init(viewModel: PackageListViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        NavigationStack {
            List(viewModel.packages) { package in
                NavigationLink {
                    PackageDetailsView(viewModel: PackageDetailsViewModel(package: package))
                } label: {
                    PackageRow(package: package)
                }
            }
            .navigationTitle("AeroNav Companion")
            .overlay {
                if viewModel.packages.isEmpty {
                    ContentUnavailableView("No sample packages", systemImage: "shippingbox")
                }
            }
            .safeAreaInset(edge: .bottom) {
                Text("NON-OPERATIONAL DEMO")
                    .font(.caption2.weight(.bold))
                    .tracking(1.2)
                    .frame(maxWidth: .infinity)
                    .padding(10)
                    .background(.ultraThinMaterial)
            }
        }
    }
}

private struct PackageRow: View {
    let package: NavigationPackage

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .firstTextBaseline) {
                Text(package.id).font(.headline)
                Spacer()
                StatusBadge(status: package.status)
            }
            Text("Cycle \(package.cycle) · \(package.region)")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Text(package.targetDevice)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 5)
    }
}

struct StatusBadge: View {
    let status: PackageStatus

    var body: some View {
        Text(status.rawValue)
            .font(.caption2.weight(.bold))
            .foregroundStyle(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.15), in: Capsule())
            .accessibilityLabel("Package status: \(status.rawValue)")
    }

    private var color: Color {
        switch status {
        case .valid: .green
        case .warning: .orange
        case .failed: .red
        }
    }
}

#Preview {
    PackageListView(viewModel: PackageListViewModel())
}
