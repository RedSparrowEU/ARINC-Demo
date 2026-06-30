import SwiftUI

@main
struct AeroNavCompanionApp: App {
    var body: some Scene {
        WindowGroup {
            PackageListView(viewModel: PackageListViewModel())
        }
    }
}
