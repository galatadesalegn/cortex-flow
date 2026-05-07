import React from "react";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Experience from "../components/home/Experience";
import Skills from "../components/home/Skills";
import Certificates from "../components/home/Certificates";
import Projects from "../components/home/Projects";
import Testimonials from "../components/home/Testimonials";
import Contact from "../components/home/Contact";

const Home = () => {
	return (
		<div>
			<Hero />
			<About />
			<Experience />
			<Skills />
			<Certificates />
			<Projects />
			<Testimonials />
			<Contact />
		</div>
	);
};

export default Home;