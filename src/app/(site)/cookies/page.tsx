import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";

export default function CookiesPage() {
    return (
        <div className="py-16 md:py-24">
            <Container>
                <div className="max-w-3xl mx-auto">
                    <SectionHeading
                        title="Cookie Policy"
                        subtitle="This is the Cookie Policy for Digifly."
                        textCenter
                        className="mb-12"
                    />
                    <div className="prose prose-lg max-w-none">
                        <h3>What Are Cookies</h3>
                        <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the sites functionality.</p>
                        
                        <h3>How We Use Cookies</h3>
                        <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>
                        
                        <h3>Disabling Cookies</h3>
                        <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.</p>
                        
                        <h3>More Information</h3>
                        <p>Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>
                        <p>If you are still looking for more information then you can contact us through one of our preferred contact methods.</p>
                    </div>
                </div>
            </Container>
        </div>
    )
}
