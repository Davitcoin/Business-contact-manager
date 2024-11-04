import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Business } from '../types/business';
import { useBusinessStore } from '../store/businessStore';

export const CsvImport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addBusiness } = useBusinessStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());

      lines.slice(1).forEach(line => {
        if (!line.trim()) return;
        
        const values = line.split(',').map(v => v.trim());
        const data: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          if (header === 'openingHours') {
            try {
              data[header] = JSON.parse(values[index]);
            } catch {
              data[header] = {
                Monday: '9:00 AM - 5:00 PM',
                Tuesday: '9:00 AM - 5:00 PM',
                Wednesday: '9:00 AM - 5:00 PM',
                Thursday: '9:00 AM - 5:00 PM',
                Friday: '9:00 AM - 5:00 PM',
                Saturday: '10:00 AM - 3:00 PM',
                Sunday: 'Closed'
              };
            }
          } else if (header === 'coordinates') {
            try {
              data[header] = JSON.parse(values[index]);
            } catch {
              data[header] = { lat: 0, lng: 0 };
            }
          } else {
            data[header] = values[index];
          }
        });

        const business: Business = {
          id: crypto.randomUUID(),
          name: data.name,
          category: data.category,
          address: data.address,
          phone: data.phone,
          email: data.email || '',
          website: data.website || '',
          rating: Number(data.rating) || 0,
          reviews: Number(data.reviews) || 0,
          openingHours: data.openingHours,
          coordinates: data.coordinates,
          lastUpdated: new Date().toISOString()
        };

        addBusiness(business);
      });
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const template = `name,category,address,phone,email,website,rating,reviews,openingHours,coordinates
"Example Business","Restaurant","123 Main St, City, Country","+1234567890","contact@example.com","https://example.com","4.5","100","{\\"Monday\\":\\"9:00 AM - 5:00 PM\\",\\"Tuesday\\":\\"9:00 AM - 5:00 PM\\",\\"Wednesday\\":\\"9:00 AM - 5:00 PM\\",\\"Thursday\\":\\"9:00 AM - 5:00 PM\\",\\"Friday\\":\\"9:00 AM - 5:00 PM\\",\\"Saturday\\":\\"10:00 AM - 3:00 PM\\",\\"Sunday\\":\\"Closed\\"}","{\\"lat\\":40.7128,\\"lng\\":-74.0060}"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleDownloadTemplate}
        className="btn-secondary"
      >
        Download CSV Template
      </button>
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="btn cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import CSV
        </label>
      </div>
    </div>
  );
};