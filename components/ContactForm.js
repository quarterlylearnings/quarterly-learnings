import { useRouter } from "next/router";

const ContactForm = () => {
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams(new FormData(e.target)).toString();
        await fetch("/__forms.html", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });
        router.push("/success");
    };

    return (
        <section className="col-span-3">
            <form
                className="space-y-4"
                name="contact"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
            >
                <input type="hidden" name="form-name" value="contact" />
                <div>
                    <label htmlFor="yourname" className="font-sans mb-1 block">Your Name:</label>
                    <input type="text" name="name" id="yourname" className="form-input rounded p-2 border font-sans text-primary" />
                </div>
                <div>
                    <label htmlFor="youremail" className="font-sans mb-1 block">Your Email Address:</label>
                    <input type="email" name="email" id="youremail" className="form-input rounded p-2 border font-sans text-primary" />
                </div>
                <div>
                    <label htmlFor="yourmessage" className="font-sans mb-1 block">Message:</label>
                    <textarea name="message" id="yourmessage" className="form-textarea w-full p-2 border rounded font-sans text-primary" rows="6"></textarea>
                </div>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-accent hover:text-primary">Send Message</button>
            </form>
        </section>
    );
};

export default ContactForm;
