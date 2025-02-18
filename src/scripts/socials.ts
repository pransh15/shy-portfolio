import Email from "@icons/email.astro";
import IconTwitter from "@icons/twitter.astro";
import IconGithub from "@icons/github.astro";
import IconLinkedin from "@icons/linkedin.astro";
import { basics } from "@cv"
export const SOCIALS = [
	{
		name: "Twitter",
		url: basics.profiles[0].url,
		icon: IconTwitter,
	},
	{
		name: "Linkedin",
		url: basics.profiles[1].url,
		icon: IconLinkedin,
	},
	{
		name: "Github",
		url: basics.profiles[2].url,
		icon: IconGithub,
	},
	{
		name: "Email",
		url: basics.email,
		icon: Email,
	},
];
