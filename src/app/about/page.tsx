import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'I’m Jacob Andersen. I’m a computer scientist and software engineer living in the Philippines.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            I’m Jacob Andersen, a computer scientist and software engineer living in the Philippines.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              I fell in love with computers when my grandfather introduced me to 
              <em> Microsoft 3D Pinball: Space Cadet</em> when I was just eight years 
              old. It was around that time that I spent much of my childhood playing,
              discovering, and learning all about computers. I wrote my first computer
              program when I was nine years old. It was a very simple website, but it
              ignited by desire for knowledge.
            </p>
            <p>
              Beyond computers, I have a deep interest for all things science. I am a 
              hobbyist physicist and engineer. I love to tinker with things, be they 
              simple physical experiments or complex technology, just to learn how and
              why things work the way they do. When I was twelve years old, I built my
              first computer from scratch after watching some YouTube videos about the
              process (to be fair, credit belongs to Linus Tech Tips.)
            </p>
            <p>
              In the real world, I love to travel. I have been to Spain (Barcelona, 
              Zaragoza, and Madrid), France (Paris), Singapore, Indonesia (Bali), and
              the Philippines (various destinations). I now live in the Philippines with
              my wife. Interestingly enough, I have been to more international destinations
              than I have States in the United States. But, that&apos;s okay with me. I love
              embracing other places and cultures.
            </p>
            <p>
              One day, I hope to help build a world that is increases the accessibility of
              travel for everyone, so that everybody might one day have the chance to open
              their eyes to the different cultures and experiences the beautiful world has
              to offer them.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            {/* <SocialLink href="#" icon={XIcon}>
              Follow on X
            </SocialLink>
            <SocialLink href="#" icon={InstagramIcon} className="mt-4">
              Follow on Instagram
            </SocialLink> */}
            <SocialLink href="https://github.com/simpleauthority" icon={GitHubIcon} className="mt-4">
              Follow on GitHub
            </SocialLink>
            <SocialLink href="https://www.linkedin.com/in/jacobsandersen" icon={LinkedInIcon} className="mt-4">
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:jacob@jacobandersen.dev"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              jacob@jacobandersen.dev
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
