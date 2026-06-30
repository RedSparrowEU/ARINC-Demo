PROJECT := AeroNavCompanion.xcodeproj
SCHEME := AeroNavCompanion
BUNDLE_ID := eu.redsparrow.AeroNavCompanion
SIMULATOR ?= iPhone 17 Pro
DERIVED_DATA := .build/DerivedData
APP_PATH := $(DERIVED_DATA)/Build/Products/Debug-iphonesimulator/AeroNavCompanion.app

.PHONY: run simulator-id

run:
	@set -e; \
	device_id="$$(xcrun simctl list devices available | sed -nE 's/^[[:space:]]*$(SIMULATOR) \(([0-9A-F-]+)\).*/\1/p' | head -1)"; \
	if [ -z "$$device_id" ]; then \
		echo "No available simulator named '$(SIMULATOR)'." >&2; \
		echo "Run 'xcrun simctl list devices available' or set SIMULATOR='<device name>'." >&2; \
		exit 1; \
	fi; \
	xcrun simctl boot "$$device_id" 2>/dev/null || true; \
	open -a Simulator; \
	xcrun simctl bootstatus "$$device_id" -b; \
	xcodebuild build \
		-project "$(PROJECT)" \
		-scheme "$(SCHEME)" \
		-configuration Debug \
		-destination "platform=iOS Simulator,id=$$device_id" \
		-derivedDataPath "$(DERIVED_DATA)"; \
	xcrun simctl install "$$device_id" "$(APP_PATH)"; \
	xcrun simctl launch "$$device_id" "$(BUNDLE_ID)"

simulator-id:
	@xcrun simctl list devices available | sed -nE 's/^[[:space:]]*$(SIMULATOR) \(([0-9A-F-]+)\).*/\1/p' | head -1
