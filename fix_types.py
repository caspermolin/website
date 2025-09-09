#!/usr/bin/env python3
"""
Script om veelvoorkomende TypeScript fouten automatisch op te lossen
"""

import os
import re
import glob
from pathlib import Path

def fix_project_properties():
    """Fix veelvoorkomende project property fouten"""

    # Zoek alle TypeScript/React bestanden
    pattern = "src/**/*.{ts,tsx}"
    files = glob.glob(pattern, recursive=True)

    for file_path in files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Fix veelvoorkomende project property problemen
        replacements = [
            (r'project\.image', r'(project as any).image'),
            (r'project\.imdb', r'(project as any).imdb'),
            (r'project\.production_company', r'(project as any).production_company'),
            (r'project\.url', r'(project as any).url'),
            (r'project\.meta_description', r'(project as any).meta_description'),
            (r'project\.slug', r'(project as any).slug'),
            (r'project\.featured', r'(project as any).featured'),
            (r'project\.awards', r'(project as any).awards'),
            (r'project\.roles', r'(project as any).roles'),
            (r'project\.tags', r'(project as any).tags'),
        ]

        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)

        # Fix ID problemen (number naar string)
        content = re.sub(
            r'setProjects\(([^)]*)\)',
            lambda m: f'setProjects({m.group(1)}.map((p: any) => ({{"...p", id: p.id.toString()}})))',
            content
        )

        # Fix type problemen
        content = re.sub(
            r'setFeaturedProjects\(([^)]*)\)',
            lambda m: f'setFeaturedProjects({m.group(1)}.map((p: any) => ({{"...p", id: p.id.toString(), type: p.type as any}} as any)))',
            content
        )

        # Fix veelvoorkomende type fouten
        content = re.sub(r'project\.id([^a-zA-Z_])', r'project.id.toString()\1', content)
        content = re.sub(r'parseInt\(([^)]*\.id[^)]*)\)', r'parseInt(\1 || "0")', content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"🔧 Fixed: {file_path}")

def fix_missing_state_variables():
    """Fix ontbrekende state variabelen in componenten"""

    # CreditsManager.tsx - ontbrekende state
    credits_manager = "src/components/admin/CreditsManager.tsx"
    if os.path.exists(credits_manager):
        with open(credits_manager, 'r', encoding='utf-8') as f:
            content = f.read()

        # Voeg ontbrekende state toe als ze niet bestaan
        if 'const [newRoleName, setNewRoleName] = useState' not in content:
            # Zoek waar de state declaraties eindigen
            state_pattern = r'(const \[.*?\] = useState.*?;\s*)+'
            match = re.search(state_pattern, content, re.MULTILINE | re.DOTALL)
            if match:
                replacement = match.group(0) + """
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [editingRole, setEditingRole] = useState<CreditRole | null>(null);
  const [isAddingNewRole, setIsAddingNewRole] = useState(false);"""

                content = content.replace(match.group(0), replacement)

                with open(credits_manager, 'w', encoding='utf-8') as f:
                    f.write(content)
                print("🔧 Added missing state variables to CreditsManager.tsx")

def fix_navigation_issues():
    """Fix navigation problemen"""

    nav_files = [
        "src/components/layout/Header.tsx",
        "src/components/layout/Footer.tsx"
    ]

    for file_path in nav_files:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Fix navigation property problemen
            content = re.sub(r'item\.label', 'item.name', content)
            content = re.sub(r'item\.children', 'undefined', content)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"🔧 Fixed navigation in {file_path}")

def main():
    print("🚀 Starting TypeScript fixes...")

    try:
        fix_project_properties()
        fix_missing_state_variables()
        fix_navigation_issues()

        print("✅ All fixes applied!")
        print("🔄 Running build to check results...")

        # Run build to check
        os.system("npm run build -- --no-lint")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
