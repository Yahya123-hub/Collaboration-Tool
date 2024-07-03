import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

import user1 from "../assets/profile-pictures/analytics.gif";
import user2 from "../assets/profile-pictures/society.gif";
import user3 from "../assets/profile-pictures/cyber-security.gif";
import user4 from "../assets/profile-pictures/browser.gif";
import user5 from "../assets/profile-pictures/computer.gif";
import user6 from "../assets/profile-pictures/web-design.gif";
import linkedin from "../assets/linkedin (1).gif";
import github from "../assets/github.png";
import gmail from "../assets/envelope.png";



export const navItems = [
  { label: "Home", href: "/" },
  { label: "Overview", href: "/overview" },
  { label: "Features", href: "/features" },
  { label: "Enhancement", href: "/enhancement" },
  { label: "Tech-Stack", href: "/tech-stack" },
  { label: "Benefits", href: "/benefits" },
  { label: "Contact", href: "/contact" },
];


export const testimonials = [
  {
    user: "Advanced Reporting and Analytics",
    company: "Stellar Solutions",
    image: user1,
    text: "Leverage customizable dashboards and detailed reports to monitor project KPIs, task completion, and team performance, enabling data-driven decision-making and continuous improvement.",
  },
  {
    user: "Enhanced Coordination",
    company: "Blue Horizon Technologies",
    image: user2,
    text: "I couldn't be happier with the outcome of our project. The team's creativity and problem-solving skills were instrumental in bringing our vision to life",
  },
  {
    user: "Robust Security and Privacy",
    company: "Quantum Innovations",
    image: user3,
    text: "Working with this company was a pleasure. Their attention to detail and commitment to excellence are commendable. I would highly recommend them to anyone looking for top-notch service.",
  },
  {
    user: "Scalable Architecture",
    company: "Fusion Dynamics",
    image: user4,
    text: "Working with the team at XYZ Company was a game-changer for our project. Their attention to detail and innovative solutions helped us achieve our goals faster than we thought possible. We are grateful for their expertise and professionalism!",
  },
  {
    user: "User-Friendly Interface",
    company: "Visionary Creations",
    image: user5,
    text: "I am amazed by the level of professionalism and dedication shown by the team. They were able to exceed our expectations and deliver outstanding results.",
  },
  {
    user: "Original Navigational Design",
    company: "Synergy Systems",
    image: user6,
    text: "The team went above and beyond to ensure our project was a success. Their expertise and dedication are unmatched. I look forward to working with them again in the future.",
  },
];

export const features = [
  {
    icon: <BotMessageSquare />,
    text: "Task Management",
    description:
      "Create, assign, and track tasks with due dates and priorities. Subtasks and checklists to break down larger tasks. Task statuses (e.g., to-do, in-progress, completed) for better tracking.",
  },
  {
    icon: <Fingerprint />,
    text: "Collaboration Tools",
    description:
      "Real-time messaging and comments on tasks and projects. File sharing and document collaboration. @Mentions to notify team members about updates.",
  },
  {
    icon: <ShieldHalf />,
    text: "Project Timelines",
    description:
      "Gantt charts to visualize project timelines and dependencies. Calendar view for tasks and milestones. Automated reminders and notifications for upcoming deadlines.",
  },
  {
    icon: <BatteryCharging />,
    text: "Resource Management",
    description:
      "Team member availability and workload management. Time tracking for tasks and projects. Allocation of resources to specific tasks and projects.",
  },
  {
    icon: <PlugZap />,
    text: "Reporting",
    description:
      "Detailed reports on task completion, project progress, and team performance.",
  },
  {
    icon: <GlobeLock />,
    text: "Analytics Dashboard",
    description:
      "Gain valuable insights into user interactions and behavior within your applications with an integrated analytics dashboard.",
  },
];

export const checklistItems = [
  {
    title: "Comprehensive Task Management",
    description:
      "Efficiently create, assign, and track tasks with customizable due dates, priorities, and statuses, alongside subtasks and checklists for better organization.",
  },
  {
    title: "Seamless Collaboration",
    description:
      "Facilitate real-time communication and collaboration with features like messaging, comments, file sharing, and @mentions, ensuring teams stay connected and informed.",
  },
  {
    title: "Visual Project Timelines",
    description:
      "Gain insights into project timelines and dependencies through intuitive Gantt charts and calendar views, coupled with automated reminders for timely project completion.",
  },
  {
    title: "Efficient Resource Management",
    description:
      "Optimize team productivity with tools for managing member availability, workload, and time tracking, alongside resource allocation to ensure tasks are completed efficiently.",
  },
];

export const pricingOptions = [
  {
    title: "MongoDB",
    price: "For Storage",
    features: [
      "Schema-less Data Model",
      "Horizontal Scalability",
      "Rich Query Language",
      "Replication for High Availability",
    ],
  },
  {
    title: "ExpressJs",
    price: "Back End",
    features: [
      "Middleware Support",
      "Routing",
      "Integration With Other Tools",
      "Minimalistic Framework",
    ],
  },
  {
    title: "React",
    price: "Front End",
    features: [
      "Component-Based Architecture",
      "Virtual DOM",
      "State Management",
      "Rich Ecosystem",
    ],
  },
  {
    title: "NodeJs",
    price: "Server Environment",
    features: [
      "Non-Blocking I/O",
      "JavaScript Everywhere",
      "NPM Ecosystem",
      "Microservices and APIs",
    ],
  },
];

export const resourcesLinks = [
  { href: "https://www.linkedin.com/in/yahyamirza/", text: "LinkedIn", image: linkedin},
  { href: "https://github.com/Yahya123-hub?tab=repositories", text: "Github", image: github},
  { href: "mailto:yahyamirza300@gmail.com", text: "Gmail", image:gmail},
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];

