import SwiftUI

struct PackageListView: View {
    @StateObject private var viewModel: PackageListViewModel

    init(viewModel: PackageListViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        NavigationStack {
            List(viewModel.packages) { package in
                VStack(alignment: .leading, spacing: 6) {
                    Text(package.id)
                        .font(.headline)
                    Text("Cycle: \(package.cycle) · Region: \(package.region)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    Text(package.status.rawValue)
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.teal)
                }
                .padding(.vertical, 4)
            }
            .navigationTitle("AeroNav Companion")
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

#Preview {
    PackageListView(viewModel: PackageListViewModel())
}
