import React from "react";
import Hero from "../Home/Hero";
import About from "../Home/About";
import Experience from "../Home/Experience";
import Skills from "../Home/Skills";
import Certificates from "../Home/Certificates";
import Projects from "../Home/Projects";
import Testimonials from "../Home/Testimonials";
import Contact from "../Home/Contact";

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