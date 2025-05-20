"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect } from "react";
import welcomeImage from "../../public/imag.jpg";
import boxIcon from "../../public/box1.png";
import bellIcon from "../../public/bell.png";
import settingsIcon from "../../public/settings.png";

const features = [
  {
    icon: boxIcon,
    title: "تتبع المخزون بدقة",
    description: "تابع عمليات الإدخال والإخراج بسهولة، وتحقق من الكميات المتوفرة في أي وقت.",
  },
  {
    icon: settingsIcon,
    title: "إدارة مرنة للمستودعات",
    description: "أضف وعدّل المنتجات والمستودعات بسهولة، ونظّم مخزونك بطريقة احترافية.",
  },
  {
    icon: bellIcon,
    title: "تنبيهات ذكية وفورية",
    description: "تلقَّ إشعارات في الوقت المناسب عند نقص أو فائض في المنتجات.",
  },
];

export default function Home() {
  useEffect(() => {
  if (!window.location.hash.includes('#loaded')) {
    window.location.hash = '#loaded';
    window.location.reload();
  }
}, []);

  return (
    <div className="container py-5">
      {/* Welcome Section */}
      <section className="row align-items-center mb-5">
        <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
          <h1 className="display-5  mb-3 text-warning">مرحبًا بك!</h1>
          <p className="lead text-secondary mb-4">
            نحن هنا لنساعدك على تنظيم وتتبع جميع العمليات داخل مستودعك بدقة وكفاءة عالية.
          </p>
          <button className="btn btn-warning px-5 py-2  shadow-sm">
            ابدأ الآن
          </button>
        </div>
        <div className="col-lg-6">
          <Image
            src={welcomeImage}
            alt="صورة ترحيبية"
            className="img-fluid rounded-4 shadow"
            style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="row text-center g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4 hover-effect">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={60}
                  className="mx-auto mb-3"
                />
                <h5 className=" text-dark mb-2">{feature.title}</h5>
                <p className="text-muted mb-0">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
