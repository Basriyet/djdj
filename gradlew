#!/usr/bin/env sh
# Minimal wrapper to bootstrap gradle if missing
DIR="."
if [ ! -f "/gradle/wrapper/gradle-wrapper.jar" ]; then
  echo 'Downloading Gradle wrapper jar...'
  curl -sSL -o "/gradle-wrapper.zip" https://services.gradle.org/distributions/gradle-8.1.1-bin.zip &&   unzip -p "/gradle-wrapper.zip" gradle-8.1.1/lib/gradle-wrapper.jar > "/gradle/wrapper/gradle-wrapper.jar" &&   rm -f "/gradle-wrapper.zip";
fi
exec java -Dorg.gradle.appname=gradlew -classpath "/gradle/wrapper/gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain "printf "#!/usr/bin/env sh
# Minimal wrapper to bootstrap gradle if missing
DIR="$(dirname "$0")"
if [ ! -f "$DIR/gradle/wrapper/gradle-wrapper.jar" ]; then
  echo 'Downloading Gradle wrapper jar...'
  curl -sSL -o "$DIR/gradle-wrapper.zip" https://services.gradle.org/distributions/gradle-8.1.1-bin.zip && \
  unzip -p "$DIR/gradle-wrapper.zip" gradle-8.1.1/lib/gradle-wrapper.jar > "$DIR/gradle/wrapper/gradle-wrapper.jar" && \
  rm -f "$DIR/gradle-wrapper.zip";
fi
exec java -Dorg.gradle.appname=gradlew -classpath "$DIR/gradle/wrapper/gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain "$@"
" > /workspace/gradlew && chmod +x /workspace/gradlew"
