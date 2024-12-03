#!/bin/bash

# Variables
GRADLE_VERSION=7.6
INSTALL_DIR="/opt/gradle"
DOWNLOAD_URL="https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip"
GRADLE_HOME="${INSTALL_DIR}/gradle-${GRADLE_VERSION}"

# Download Gradle
echo "Downloading Gradle ${GRADLE_VERSION}..."
wget -q "${DOWNLOAD_URL}" -O /tmp/gradle-${GRADLE_VERSION}-bin.zip
if [ $? -ne 0 ]; then
    echo "Failed to download Gradle. Check your internet connection and the version specified."
    exit 1
fi

# Extract Gradle
echo "Installing Gradle to ${INSTALL_DIR}..."
mkdir -p "${INSTALL_DIR}"
unzip -q /tmp/gradle-${GRADLE_VERSION}-bin.zip -d "${INSTALL_DIR}"

ln -s ${GRADLE_HOME}/bin/gradle /usr/local/bin/gradle

# Clean up
echo "Cleaning up temporary files..."
rm -f /tmp/gradle-${GRADLE_VERSION}-bin.zip

# Verify installation
echo "Verifying Gradle installation..."
gradle --version
if [ $? -eq 0 ]; then
    echo "Gradle ${GRADLE_VERSION} installed successfully!"
else
    echo "Gradle installation failed."
    exit 1
fi
