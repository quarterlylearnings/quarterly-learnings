import Image from "next/image";
import styles from "../styles/Home.module.css";
import curriculumDesign from "../public/curriculum-design.png";
import progDevOps from "../public/program-development.png";
import instruction from "../public/instruction.png";
import instructionRear from "../public/instruction-rear.jpg";
import Layout from "../components/layout";
import Link from "next/link";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <Layout>
            <section className="col-span-3 p-4 bg-secondary text-white text-center rounded">
                <div className="">
                    <div className="">
                        <h1 className="text-4xl font-serif mb-2 text-wrap">
                            Empower Your Team with Cutting-Edge Tech Skills.
                        </h1>
                        <Image src={instructionRear} width={800} height={500} alt={"Brandon Campbell-Kearns, seen from the rear of a room, teaching digital skills to a group of professionals, with a focus on web development."} />
                    </div>
                    <div>

                    <h6 className="font-sans mb-4 text-wrap">
                        Unleash creativity and innovation by learning to build
                        and automate with the latest software tools.
                    </h6>
                    <Link href="/contact" className="inline-block bg-primary text-tertiary px-6 py-2 rounded cursor-pointer">
                        Schedule your workshop.
                    </Link>
                    </div>
                </div>
            </section>

            <section className="col-span-full sm:col-span-1 p-4 bg-tertiary text-white text-center rounded">
                <aside>
                    <h4 className="text-2xl font-serif mb-2">
                        Curriculum Design
                    </h4>
                    <p className="font-sans mb-4">
                        We&apos;ll help you design a custom curriculum targeted
                        to your initiative
                    </p>
                </aside>
                <Image
                    src={curriculumDesign}
                    width={400}
                    height={300}
                    alt={""}
                />
            </section>

            <section className="col-span-full sm:col-span-2 p-4 bg-tertiary text-white text-center rounded">
                <aside>
                    <h4 className="text-2xl font-serif mb-2">
                        Ongoing Workshops
                    </h4>
                    <p className="font-sans mb-4">
                        1/2 day to multi-day workshops to improve your skills
                    </p>
                </aside>
                <Image src={instruction} width={400} height={300} alt={""} />
            </section>

            <section className="col-span-full sm:col-span-3 p-4 bg-tertiary text-white text-center rounded">
                <aside>
                    <h4 className="text-2xl font-serif mb-2">
                        Custom Software Training
                    </h4>
                    <p className="font-sans mb-4">
                        Enroll your team in a skill-based workshop
                    </p>
                </aside>
                <Image src={progDevOps} width={400} height={300} alt={""} />
            </section>

      <div className={styles.testimonials}>
        
        <section className={styles.quotes}>
          
        </section>
      </div>

    </Layout>
  )
}
