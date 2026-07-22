import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <p className="text-xs uppercase tracking-[0.2em] text-brass-dark mb-6">
            Thương mại &amp; đặt gia công · Vàng · Bạc · Đá quý
          </p>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] max-w-3xl">
            Quà tặng và biểu trưng bằng vàng bạc, đúc theo dấu ấn riêng
            của tổ chức bạn.
          </h1>
          <p className="mt-6 max-w-xl text-ink/70 text-base sm:text-lg">
            Chúng tôi là đơn vị thương mại, kết nối cơ quan, tổ chức, doanh
            nghiệp với các xưởng gia công vàng bạc, đá quý uy tín — từ
            kỷ niệm chương, quà tặng đối ngoại đến trang sức đặt riêng
            theo số lượng lớn.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="border border-ink px-6 py-3 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring"
            >
              Xem danh mục sản phẩm
            </Link>
            <Link
              href="/quote"
              className="border border-brass text-brass-dark px-6 py-3 text-sm hover:bg-brass hover:text-parchment transition-colors focus-ring"
            >
              Gửi yêu cầu báo giá
            </Link>
          </div>
        </section>

        <section id="ve-chung-toi" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-16 grid sm:grid-cols-3 gap-10">
            <div>
              <span className="font-display text-3xl text-brass-dark">01</span>
              <h2 className="mt-3 font-display text-xl">Tư vấn &amp; thiết kế</h2>
              <p className="mt-2 text-sm text-ink/70">
                Trao đổi yêu cầu về mẫu mã, chất liệu, ngân sách và số lượng
                cho quà tặng hoặc trang sức của tổ chức.
              </p>
            </div>
            <div>
              <span className="font-display text-3xl text-brass-dark">02</span>
              <h2 className="mt-3 font-display text-xl">Đặt gia công</h2>
              <p className="mt-2 text-sm text-ink/70">
                Kết nối với xưởng gia công vàng, bạc, đá quý phù hợp, kiểm
                soát chất lượng và tiến độ thay bạn.
              </p>
            </div>
            <div>
              <span className="font-display text-3xl text-brass-dark">03</span>
              <h2 className="mt-3 font-display text-xl">Bàn giao &amp; hậu mãi</h2>
              <p className="mt-2 text-sm text-ink/70">
                Đóng gói, giao nhận theo lô và hỗ trợ bảo hành, điều chỉnh
                sau khi bàn giao.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
