import * as XLSX from 'xlsx';

const generateFileBuffer = (s: any) => {
  const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  const view = new Uint8Array(buf); //create uint8array as viewer
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
  return buf;
};

const saveAs = (blob: any, fileName: any) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

const saveAsByLink = (url: string, fileName: string) => {
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.download = 'download';
  link.href = url;
  link.download = fileName;
  link.click();
  document.body.removeChild(link);
};

const downloadExcel = (title: string, fileName: string, data: any[][], colsWch: any[]) => {
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: title,
    Subject: ''
  };
  wb.SheetNames.push(title);

  const ws = XLSX.utils.aoa_to_sheet(data);
  // [{ wch: 18 }]
  ws['!cols'] = colsWch;
  wb.Sheets[title] = ws;
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  saveAs(new Blob([generateFileBuffer(wbout)], { type: 'application/octet-stream' }), fileName);
};

const saveAsBlob = (blob: any, fileName: any) => {
  const a = window.document.createElement('a');
  // a.style = 'display:none;';
  // const url = window.URL.createObjectURL(blob);
  a.download = fileName;
  a.href = blob;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  a.remove();
};

export { downloadExcel, saveAs, saveAsByLink, saveAsBlob };
