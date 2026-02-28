import React from "react";

export default function CEditor() {
  const sample = `#include <stdio.h>

struct Student {
  int id;
  float gpa;
  char name[32];
};

int main() {
  FILE *f = fopen("db.bin","rb");
  fseek(f, sizeof(struct Student)*1, SEEK_SET);
  // ...
  return 0;
}
`;

  return (
    <div className="code-area">
      <div className="editor-header">
        <div>editor.c</div>
        <div className="editor-actions">
          <button className="btn subtle">Format</button>
          <button className="btn subtle">Save</button>
        </div>
      </div>

      <textarea
        className="editor-textarea"
        defaultValue={sample}
        spellCheck="false"
      />
    </div>
  );
}