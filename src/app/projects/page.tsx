import { type Metadata } from 'next'
import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'

const projects = [
  {
    name: 'Arkitektonika',
    description:
      'Arkitektonika is a small purpose-built webserver and file repository that is made to temporarily store uploaded NBT (Named Binary Tag) format files for sharing with others or transferal between other systems. Arkitektonika was originally written by me for IntellectualSites, a loose open-source software collective. The code has changed since my original contributions.',
    link: { href: 'https://github.com/IntellectualSites/Arkitektonika', label: 'github.com' },
  },
  {
    name: 'Cycles',
    description:
      'Note: There are some issues with the time intervals at present. The cycles app allows you to choose whether or not you are going to sleep now or if you have a specific time you\'d like to wake up. Once you\'ve made your choice, it calculates a few optimal times at which you should be asleep in order to maximize your sleep cycles and thereby your sleep efficiency.',
    link: { href: 'https://apps.jacobandersen.dev/cycles', label: 'apps.jacobandersen.dev' },
  },
  {
    name: 'MCBanners',
    description:
      'MCBanners is a free service for Minecraft server operators and game modification developers to generate dynamic images that represent their server and/or software. Nearly the entire (primitive) microservices-based infrastructure was written by me using Spring in approximately one month.',
    link: { href: 'https://mcbanners.com', label: 'mcbanners.com' },
  },
  {
    name: 'Mediabox',
    description:
      'Mediabox is a "media server in a box". If you know how to use Docker and Docker Compose, then you simply download Mediabox and run the "docker-compose.yml" file. Once it\'s all up, you\'re off to the races. You can search for movies and TV for download and automatic metadata sorting with Plex.',
    link: { href: 'https://github.com/simpleauthority/mediabox', label: 'github.com' },
  },
  {
    name: 'Mindmapper',
    description:
      'Mindmapper is an application that allows the user to organize their thoughts for critical thinking. The user can enter a main idea and sub-ideas which extend from it. For each sub-idea, there can be multiple counterpoints, and for each counterpoint there can be multiple rebuttals. Finally, the user can export the end-result to PDF for safe keeping.',
    link: { href: 'https://apps.jacobandersen.dev/mindmapper', label: 'apps.jacobandersen.dev' },
  },
  {
    name: 'Pundasyon',
    description:
      'Pundasyon means "Foundation" in Tagalog. This is an API written in Java using Spring to provide a few services that my other apps depend on. For example, Weather uses Pundasyon to find location and weather condition data as well as access Wikipedia. There\'s not much to see, though.',
    link: { href: 'https://github.com/simpleauthority/pundasyon', label: 'github.com' },
  },
  {
    name: 'Weather',
    description:
      'Note: Being reworked. Please excuse some issues in the app. Weather is a simple app that lets you look up the current weather conditions for any arbitrary location. It uses OpenCage to geocode a place name to coordinates, OpenWeatherMap to find current conditions at those coordinates, and Wikipedia to find a nice background image that (hopefully) nicely represents those coordinates.',
    link: { href: 'https://apps.jacobandersen.dev/weather', label: 'apps.jacobandersen.dev' },
  },
]

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things I’ve made trying to put my dent in the universe.',
}

export default function Projects() {
  return (
    <SimpleLayout
      title="Things I’ve made over the years for fun and learning."
      intro="I've worked on so many little projects over the years. These ones are my particular favorites. All of them are open-source, so if you see something that piques your interest, check out the code and contribute if you have ideas for how it can be improved."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Card as="li" key={project.name}>
            {/* <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image
                src={project.logo}
                alt=""
                className="h-8 w-8"
                unoptimized
              />
            </div> */}
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={project.link.href}>{project.name}</Card.Link>
            </h2>
            <Card.Description>{project.description}</Card.Description>
            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
              <LinkIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">{project.link.label}</span>
            </p>
          </Card>
        ))}
      </ul>
    </SimpleLayout>
  )
}
