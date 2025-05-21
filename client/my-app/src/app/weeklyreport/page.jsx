'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function WeeklyReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [token,setToken] = useState("");
  const router = useRouter();
  

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }
  }, [router]);
  
  const [selectedTables, setSelectedTables] = useState({
    inputs: true,
    withdrawals: true,
    totalInputs: true,
    totalWithdrawals: true,
    difference: true,
  });

  const handleTableToggle = (key) => {
    setSelectedTables(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      alert('يرجى تحديد تاريخ البداية والنهاية');
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({ start: startDate, end: endDate });
      const res = await fetch(`http://localhost:8000/api/weekly-report?${query}`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('فشل تحميل التقرير', err);
      alert('حدث خطأ أثناء تحميل التقرير');
    }
    setLoading(false);
  };

  const printReport = () => window.print();

  const getProductDifferences = () => {
    const map = {};

    report?.totalInputs?.forEach(item => {
      map[item.name] = { in: item.total_quantity, out: 0 };
    });

    report?.totalWithdrawals?.forEach(item => {
      if (!map[item.name]) {
        map[item.name] = { in: 0, out: item.total_quantity };
      } else {
        map[item.name].out = item.total_quantity;
      }
    });

    return Object.entries(map).map(([name, val]) => ({
      name,
      in: val.in,
      out: val.out,
      diff: val.in - val.out,
    }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 تقرير مخصص حسب التاريخ</h1>

      <div style={styles.datePickerContainer}>
        <label>من: </label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={styles.input} />
        <label style={{ marginLeft: '1rem' }}>إلى: </label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={styles.input} />
        <button onClick={fetchReport} style={styles.button}>تحميل التقرير</button>
        <button onClick={printReport} style={styles.button}>🖨️ طباعة</button>
      </div>

      <div style={styles.checkboxGroup}>
        <label><input type="checkbox" checked={selectedTables.inputs} onChange={() => handleTableToggle('inputs')} /> المدخلات</label>
        <label><input type="checkbox" checked={selectedTables.withdrawals} onChange={() => handleTableToggle('withdrawals')} /> السحوبات</label>
        <label><input type="checkbox" checked={selectedTables.totalInputs} onChange={() => handleTableToggle('totalInputs')} /> مجموع المدخلات</label>
        <label><input type="checkbox" checked={selectedTables.totalWithdrawals} onChange={() => handleTableToggle('totalWithdrawals')} /> مجموع السحوبات</label>
        <label><input type="checkbox" checked={selectedTables.difference} onChange={() => handleTableToggle('difference')} /> الفرق</label>
      </div>

      {loading && <p style={styles.loadingText}>جارٍ تحميل البيانات...</p>}

      {!loading && report && (
        <>
          {selectedTables.inputs && (
            <>
              <h5 style={styles.sectionTitle}>المدخلات</h5>
              <Table data={report.inputs} columns={['id', 'name', 'status', 'quantity', 'note', 'timestamp']} />
            </>
          )}

          {selectedTables.withdrawals && (
            <>
              <h5 style={styles.sectionTitle}>السحوبات</h5>
              <Table data={report.withdrawals} columns={['id', 'product_id', 'status', 'quantity', 'recipient', 'note', 'timestamp']} />
            </>
          )}

          {selectedTables.totalInputs && (
            <>
              <h5 style={styles.sectionTitle}>مجموع المدخلات حسب المنتج</h5>
              <Table data={report.totalInputs} columns={['name', 'total_quantity']} />
            </>
          )}

          {selectedTables.totalWithdrawals && (
            <>
              <h5 style={styles.sectionTitle}>مجموع السحوبات حسب المنتج</h5>
              <Table data={report.totalWithdrawals} columns={['name', 'total_quantity']} />
            </>
          )}

          {selectedTables.difference && (
            <>
              <h5 style={styles.sectionTitle}>الفرق بين المدخلات والسحوبات</h5>
              <Table data={getProductDifferences()} columns={['name', 'in', 'out', 'diff']} />
            </>
          )}
        </>
      )}
    </div>
  );
}

// 🟢 ترجمة أسماء الأعمدة للعربية
const columnNames = {
  id: 'رقم',
  name: 'المنتج',
  status: 'الحالة',
  quantity: 'الكمية',
  note: 'ملاحظة',
  timestamp: 'الوقت',
  product_id: 'رقم المنتج',
  recipient: 'المستلم',
  total_quantity: 'إجمالي الكمية',
  in: 'المدخلات',
  out: 'السحوبات',
  diff: 'الفرق',
};

function Table({ data, columns }) {
  if (!data || data.length === 0) return <p style={styles.noDataText}>📭 لا توجد بيانات.</p>;

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col} style={styles.tableHeader}>{columnNames[col] || col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} style={styles.tableRow}>
            {columns.map(col => (
              <td key={col} style={styles.tableCell}>
                {col === 'id' ? idx + 1 : row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  title: {
    fontSize: '16px',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  datePickerContainer: {
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  checkboxGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    fontSize: '14px',
  },
  input: {
    padding: '0.5rem',
    margin: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor:'#f8f9fa',
    color:'black',
    fontSize: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginLeft: '1rem',
    marginTop: '0.5rem',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1.2rem',
  },
  sectionTitle: {
    fontSize: '16px',
    marginTop: '2rem',
    color: '#333',
    textAlign:'center',
  },
  table: {
    width: '68%',
    borderCollapse: 'collapse',
    marginBottom: '2rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginLeft: 'auto',
    marginRight: 'auto',
    tableLayout: 'auto',
  },
  tableHeader: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '0.6rem',
    textAlign: 'left',
    fontSize: '14px',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableCell: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    textAlign: 'left',
    fontSize: '12px',
    minWidth: '100px',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#777',
  },
};
