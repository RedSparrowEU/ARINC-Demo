import SwiftUI

struct PackageDetailsView: View {
    @StateObject private var viewModel: PackageDetailsViewModel

    init(viewModel: PackageDetailsViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        List {
            Section("Status") {
                LabeledContent("Validation") { StatusBadge(status: viewModel.package.status) }
                Text("Representative display state only; mobile validation begins in Phase 2.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Section("Package metadata") {
                LabeledContent("Package ID", value: viewModel.package.id)
                LabeledContent("Provider", value: viewModel.package.provider)
                LabeledContent("Source", value: viewModel.package.source)
                LabeledContent("Cycle", value: viewModel.package.cycle)
                LabeledContent("Region", value: viewModel.package.region)
                LabeledContent("Target device", value: viewModel.package.targetDevice)
                LabeledContent("Effective", value: viewModel.effectivePeriod)
            }

            ForEach(viewModel.categoryGroups) { group in
                Section(group.category.capitalized) {
                    ForEach(group.files) { file in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(file.path).font(.body.monospaced())
                            Text(file.required ? "Required" : "Optional")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }

            if viewModel.categoryGroups.isEmpty {
                Section("Package contents") {
                    Text("No files declared").foregroundStyle(.secondary)
                }
            }
        }
        .navigationTitle(viewModel.package.cycle)
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    NavigationStack {
        PackageDetailsView(viewModel: PackageDetailsViewModel(package: SamplePackages.valid))
    }
}
