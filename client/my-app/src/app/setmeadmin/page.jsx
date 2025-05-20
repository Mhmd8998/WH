"use client"
export default function SetMeAdmin() {
  const handleClick = async () => {
    try {
      const response = await fetch('/api/set-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ id: 123 }), // إذا كان هناك بيانات تُرسل
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // "تم ترقية المستخدم إلى مسؤول بنجاح."
      } else {
        alert(`خطأ: ${data.message}`);
      }
    } catch (error) {
      alert('حدث خطأ أثناء إرسال الطلب.');
      console.error(error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <button className="btn btn-success" onClick={handleClick}>
        ترقية المستخدم إلى مسؤول
      </button>
    </div>
  );
}
