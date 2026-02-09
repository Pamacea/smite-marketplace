/**
 * SMITE Version Utilities
 *
 * Version parsing and comparison for semantic versioning.
 */

export interface Semver {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
}

/**
 * Parse semver string
 */
export function parseSemver(version: string): Semver {
  // Match: 1.2.3 or 1.2.3-alpha or 1.2.3-beta.1+build.123
  const match = version.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-\.]+))?(?:\+([0-9A-Za-z-\.]+))?$/
  );

  if (!match) {
    throw new Error(`Invalid semver: ${version}`);
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4],
    build: match[5],
  };
}

/**
 * Format semver to string
 */
export function formatSemver(semver: Semver): string {
  let result = `${semver.major}.${semver.minor}.${semver.patch}`;

  if (semver.prerelease) {
    result += `-${semver.prerelease}`;
  }

  if (semver.build) {
    result += `+${semver.build}`;
  }

  return result;
}

/**
 * Compare two versions
 * Returns: -1 if v1 < v2, 0 if v1 == v2, 1 if v1 > v2
 */
export function compareVersions(v1: string | Semver, v2: string | Semver): number {
  const s1 = typeof v1 === 'string' ? parseSemver(v1) : v1;
  const s2 = typeof v2 === 'string' ? parseSemver(v2) : v2;

  // Compare major, minor, patch
  if (s1.major !== s2.major) {
    return s1.major < s2.major ? -1 : 1;
  }

  if (s1.minor !== s2.minor) {
    return s1.minor < s2.minor ? -1 : 1;
  }

  if (s1.patch !== s2.patch) {
    return s1.patch < s2.patch ? -1 : 1;
  }

  // Prerelease versions come before release versions
  const pre1 = s1.prerelease || '';
  const pre2 = s2.prerelease || '';

  if (pre1 && !pre2) return -1;
  if (!pre1 && pre2) return 1;
  if (pre1 && pre2 && pre1 !== pre2) {
    return pre1 < pre2 ? -1 : 1;
  }

  return 0;
}

/**
 * Check if version satisfies minimum constraint
 * Returns true if version >= constraint
 */
export function satisfiesVersion(version: string | Semver, constraint: string | Semver): boolean {
  return compareVersions(version, constraint) >= 0;
}

/**
 * Bump version
 */
export function bumpVersion(
  version: string | Semver,
  type: 'major' | 'minor' | 'patch'
): Semver {
  const semver = typeof version === 'string' ? parseSemver(version) : version;

  switch (type) {
    case 'major':
      return {
        major: semver.major + 1,
        minor: 0,
        patch: 0,
      };
    case 'minor':
      return {
        major: semver.major,
        minor: semver.minor + 1,
        patch: 0,
      };
    case 'patch':
      return {
        major: semver.major,
        minor: semver.minor,
        patch: semver.patch + 1,
      };
  }
}

/**
 * Get version range
 */
export function getVersionRange(version: string): string {
  const semver = parseSemver(version);
  return `^${semver.major}.${semver.minor}.${semver.patch}`;
}
