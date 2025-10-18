#!/usr/bin/env bash
set -euo pipefail

# This script bootstraps Godot headless + Android SDK and exports a debug APK locally.
# Outputs to build/android/FantasiaFarmRPG-debug.apk

ROOT_DIR=$(cd "$(dirname "$0")"/../.. && pwd)
WORK_DIR="$ROOT_DIR/.local"
GODOT_VERSION="4.3"
GODOT_REL="stable"
GODOT_DL="https://downloads.tuxfamily.org/godotengine/$GODOT_VERSION/$GODOT_REL"
GODOT_HEADLESS_ZIP="Godot_v${GODOT_VERSION}-${GODOT_REL}_linux.x86_64.zip"
GODOT_TEMPLATES_ZIP="Godot_v${GODOT_VERSION}-${GODOT_REL}_export_templates.tpz"

mkdir -p "$WORK_DIR" "$ROOT_DIR/build/android"

if ! command -v unzip >/dev/null 2>&1; then
  echo "Please install unzip" >&2
  exit 1
fi

# Download Godot headless (GUI binary works too) and templates if missing
if [ ! -d "$WORK_DIR/godot" ]; then
  echo "Downloading Godot..."
  curl -L "$GODOT_DL/$GODOT_HEADLESS_ZIP" -o "$WORK_DIR/godot.zip"
  mkdir -p "$WORK_DIR/godot"
  unzip -q "$WORK_DIR/godot.zip" -d "$WORK_DIR/godot"
  rm "$WORK_DIR/godot.zip"
fi

if [ ! -d "$WORK_DIR/templates" ]; then
  echo "Downloading export templates..."
  curl -L "$GODOT_DL/$GODOT_TEMPLATES_ZIP" -o "$WORK_DIR/templates.tpz"
  mkdir -p "$WORK_DIR/templates"
  unzip -q "$WORK_DIR/templates.tpz" -d "$WORK_DIR/templates"
  rm "$WORK_DIR/templates.tpz"
fi

GODOT_BIN=$(find "$WORK_DIR/godot" -type f -name "Godot_*_linux.x86_64" | head -n1)
chmod +x "$GODOT_BIN"

# Install templates into a portable templates dir
TEMPLATES_DIR="$WORK_DIR/templates_installed"
mkdir -p "$TEMPLATES_DIR"
# Copy all template contents
cp -r "$WORK_DIR/templates"/* "$TEMPLATES_DIR" || true

# Configure a portable Godot config dir so templates are found
export XDG_DATA_HOME="$WORK_DIR/xdg_data"
mkdir -p "$XDG_DATA_HOME/godot/templates"
# Link templates into expected location
if [ ! -e "$XDG_DATA_HOME/godot/templates/${GODOT_VERSION}.${GODOT_REL}" ]; then
  ln -s "$TEMPLATES_DIR" "$XDG_DATA_HOME/godot/templates/${GODOT_VERSION}.${GODOT_REL}"
fi

# Android SDK minimal via commandlinetools
ANDROID_DIR="$WORK_DIR/android-sdk"
CMDLINE_TOOLS_ZIP_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
if [ ! -d "$ANDROID_DIR" ]; then
  echo "Installing Android command line tools..."
  mkdir -p "$ANDROID_DIR"
  curl -L "$CMDLINE_TOOLS_ZIP_URL" -o "$WORK_DIR/cmdline-tools.zip"
  unzip -q "$WORK_DIR/cmdline-tools.zip" -d "$ANDROID_DIR"
  rm "$WORK_DIR/cmdline-tools.zip"
  mkdir -p "$ANDROID_DIR/cmdline-tools/latest"
  mv "$ANDROID_DIR/cmdline-tools"/* "$ANDROID_DIR/cmdline-tools/latest" || true
fi

export ANDROID_SDK_ROOT="$ANDROID_DIR"
export ANDROID_HOME="$ANDROID_DIR"
export JAVA_HOME="$(dirname $(dirname $(readlink -f $(which javac))))"
export PATH="$ANDROID_DIR/cmdline-tools/latest/bin:$ANDROID_DIR/platform-tools:$ANDROID_DIR/build-tools/34.0.0:$PATH"

# Install required Android components
yes | sdkmanager --licenses || true
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" >/dev/null

# Configure Godot Android export settings via environment
# Note: We rely on debug keystore auto-generation by Gradle when using use_gradle_build=true

cd "$ROOT_DIR"
"$GODOT_BIN" --headless --path "$ROOT_DIR" --export-debug "Android Debug" "build/android/FantasiaFarmRPG-debug.apk"

echo "APK built: $ROOT_DIR/build/android/FantasiaFarmRPG-debug.apk"
