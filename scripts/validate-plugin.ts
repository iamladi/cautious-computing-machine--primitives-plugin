#!/usr/bin/env bun
import { z } from 'zod';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const PluginManifestSchema = z.object({
  name: z.string(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format'),
  description: z.string(),
  author: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    url: z.string().url().optional(),
  }),
  homepage: z.string().url().optional(),
  repository: z.string().url().optional(),
  license: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  commands: z.union([z.string(), z.array(z.string())]).optional(),
  agents: z.union([z.string(), z.array(z.string())]).optional(),
  hooks: z.union([z.string(), z.record(z.any())]).optional(),
  mcpServers: z.union([z.string(), z.record(z.any())]).optional(),
});

const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[a-z0-9-]+$/, 'Name must contain only lowercase letters, numbers, and hyphens')
    .max(64, 'Name must be 64 characters or less'),
  description: z.string()
    .min(1, 'Description is required')
    .max(1024, 'Description must be 1024 characters or less'),
  'allowed-tools': z.string().optional(),
});

function parseFrontmatter(content: string): { frontmatter: Record<string, any>, body: string } | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  const frontmatterText = match[1];
  const body = content.slice(match[0].length);

  // Simple YAML parser for our needs
  const frontmatter: Record<string, any> = {};
  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

async function validateSkills() {
  const skillsDir = join(process.cwd(), 'skills');

  if (!existsSync(skillsDir)) {
    console.log('ℹ️  No skills directory found, skipping skill validation');
    return;
  }

  const entries = await readdir(skillsDir, { withFileTypes: true });
  const skillDirs = entries.filter(entry => entry.isDirectory());

  if (skillDirs.length === 0) {
    console.log('ℹ️  No skills found, skipping skill validation');
    return;
  }

  let hasErrors = false;

  for (const skillDir of skillDirs) {
    const skillPath = join(skillsDir, skillDir.name);
    const skillFilePath = join(skillPath, 'SKILL.md');

    if (!existsSync(skillFilePath)) {
      console.error(`❌ Skill '${skillDir.name}' is missing SKILL.md file`);
      hasErrors = true;
      continue;
    }

    try {
      const content = await readFile(skillFilePath, 'utf-8');
      const parsed = parseFrontmatter(content);

      if (!parsed) {
        console.error(`❌ Skill '${skillDir.name}': SKILL.md must start with YAML frontmatter (---)`);
        hasErrors = true;
        continue;
      }

      const result = SkillFrontmatterSchema.safeParse(parsed.frontmatter);

      if (!result.success) {
        console.error(`❌ Skill '${skillDir.name}' validation failed:`);
        console.error(JSON.stringify(result.error.format(), null, 2));
        hasErrors = true;
        continue;
      }

      console.log(`✅ Skill '${result.data.name}' is valid`);

    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Error validating skill '${skillDir.name}':`, error.message);
      }
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }
}

async function validatePlugin() {
  const pluginJsonPath = join(process.cwd(), '.claude-plugin/plugin.json');

  try {
    const content = await readFile(pluginJsonPath, 'utf-8');
    const json = JSON.parse(content);

    const result = PluginManifestSchema.safeParse(json);

    if (!result.success) {
      console.error('❌ Plugin validation failed:');
      console.error(JSON.stringify(result.error.format(), null, 2));
      process.exit(1);
    }

    console.log(`✅ ${result.data.name} v${result.data.version} is valid`);

  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error reading plugin.json:', error.message);
    }
    process.exit(1);
  }
}

async function main() {
  await validatePlugin();
  await validateSkills();
}

main();
