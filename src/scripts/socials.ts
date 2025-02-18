// @ts-ignore
import Email from "@icons/email.astro";
// @ts-ignore
import IconTwitter from "@icons/twitter.astro";
// @ts-ignore
import IconGithub from "@icons/github.astro";
// @ts-ignore
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
		url: `mailto:${basics.email}`,
		icon: Email,
	},
];
