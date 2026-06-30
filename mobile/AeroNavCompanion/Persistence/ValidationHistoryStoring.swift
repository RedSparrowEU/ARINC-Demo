protocol ValidationHistoryStoring: Sendable {
    var entryCount: Int { get async }
}

actor InMemoryValidationHistoryStore: ValidationHistoryStoring {
    private var entries: [String] = []

    var entryCount: Int { entries.count }
}
