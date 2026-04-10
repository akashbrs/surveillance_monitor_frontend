const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, 'src', 'pages', 'SettingsPage.tsx');
let txt = fs.readFileSync(targetPath, 'utf8');

// Add imports
if (!txt.includes('import { Select')) {
  txt = txt.replace(
    'import { Switch } from "@/components/ui/switch";',
    'import { Switch } from "@/components/ui/switch";\nimport { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";'
  );
}

// Ensure selectCls is still there
if (!txt.includes('const selectCls')) {
  txt = txt.replace('const inputCls =', 'const selectCls = `${inputCls} cursor-pointer`;\nconst inputCls =');
}

// Regex to find <select ...> ... </select>
const selectRegex = /<select([^>]*)>([\s\S]*?)<\/select>/g;

txt = txt.replace(selectRegex, (match, attrs, innerOptions) => {
  // Extract props
  let disabledStr = '';
  if (/disabled=\{([^\}]+)\}/.test(attrs)) {
    const dMatch = attrs.match(/disabled=\{([^\}]+)\}/);
    disabledStr = ` disabled={${dMatch[1]}}`;
  } else if (/disabled(\s|>|$)/.test(attrs)) {
    disabledStr = ` disabled`;
  }

  let onValueChangeStr = '';
  if (/onChange=\{([^\}]+)\}/.test(attrs)) {
    let onChangeMatch = attrs.match(/onChange=\{([^\}]+)\}/);
    // Convert (e) => setSomething(e.target.value) to (v) => setSomething(v)
    let handler = onChangeMatch[1];
    handler = handler.replace(/\(e\)\s*=>\s*\{\s*([a-zA-Z0-9_]+)\(e\.target\.value\)/, '(v) => { $1(v)');
    handler = handler.replace(/onChange=\{markDirty\}/, 'onValueChange={markDirty}');
    if (handler === 'markDirty') {
       onValueChangeStr = ` onValueChange={markDirty}`;
    } else {
       onValueChangeStr = ` onValueChange={${handler}}`;
    }
  }

  let valueStr = '';
  if (/value=\{([^\}]+)\}/.test(attrs)) {
    const vMatch = attrs.match(/value=\{([^\}]+)\}/);
    valueStr = ` value={${vMatch[1]}}`;
  }

  // Parse inner options
  const optionRegex = /<option([^>]*)>([\s\S]*?)<\/option>/g;
  let optionsText = '';
  let defaultValue = '';
  
  let optMatch;
  while ((optMatch = optionRegex.exec(innerOptions)) !== null) {
    const optAttrs = optMatch[1];
    const valText = optMatch[2].trim();
    if (/selected/.test(optAttrs)) defaultValue = valText;
    optionsText += `\n              <SelectItem value="${valText}">${valText}</SelectItem>`;
  }
  
  if (!defaultValue && innerOptions.includes('<option')) {
     const firstOpt = innerOptions.match(/<option[^>]*>([\s\S]*?)<\/option>/);
     if (firstOpt) defaultValue = firstOpt[1].trim();
  }

  // If component is controlled (has value prop), we might not need defaultValue
  const defaultValProp = valueStr ? '' : ` defaultValue="${defaultValue}"`;

  return `<Select${onValueChangeStr}${valueStr}${defaultValProp}${disabledStr}>
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-[9999]">${optionsText}
              </SelectContent>
            </Select>`;
});

fs.writeFileSync(targetPath, txt);
console.log('Selects replaced successfully.');
