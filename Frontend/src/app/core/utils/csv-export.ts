export function downloadCsv(filename: string, header: string[], rows: unknown[][]): void {
  const csv = [header, ...rows]
    .map((line) => line.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  // The anchor must be attached to the document for `.click()` to reliably trigger a download in
  // every browser, and revoking the blob URL immediately (before the download has actually
  // started reading it) silently corrupts/empties the file in some browsers — both are why the
  // previous inline version of this code didn't work outside of automated headless testing.
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
