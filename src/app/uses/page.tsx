import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description: 'Software, hardware, and other tools I use to do my work.',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="Software, hardware, and other tools I use to do my work."
      intro="People sometimes ask me what tools I use to build software, stay productive, or otherwise enjoy. Here’s a big list of all of my favorite stuff."
    >
      <div className="space-y-20">
        <ToolsSection title="Workstation">
          <Tool title="14” MacBook Pro, M1 Pro, 16GB RAM (2021)">
            I was using an Intel-based 16” MacBook Pro prior to this and the
            difference is astounding. My fans used to fire up regularly, even
            just idling. I am honestly not sure this machine&apos;s fans have turned
            on once.
          </Tool>
          <Tool title="ASUS VP249QGR Full HD monitor">
            It&apos;s cheap, and it works. While I would like to have a whole lot more
            pixels at my disposal, this one works for now.
          </Tool>
          <Tool title="Keychron K4 Keyboard">
            This keyboard is a lovely little piece of hardware with a very satisfying
            click. 
          </Tool>
          <Tool title="Razer Basilisk X Hyperspeed">
            This mouse fits really well in the palm of my hand and offers all the functionality
            I require from a mouse. It has adjustable DPI to change the mouse speed for different
            users as necessary, and works quite reliably. It&apos;s also wireless, allowing me to move it
            around as needed.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Development tools">
          <Tool title="Visual Studio Code">
            I use Visual Studio Code for frontend web development, some backend web development (i.e.,
            in the Backends for Frontend pattern), Rust, C, and PHP.
          </Tool>
          <Tool title="IntelliJ IDEA">
            IntelliJ is my weapon of choice for Java, which I use when playing around with Minecraft or
            developing a Spring application.
          </Tool>
          <Tool title="JetBrains DataGrip">
            Yep, another JetBrains tool. I use DataGrip as my main database manager, schema tool, and SQL
            suite.
          </Tool>
          <Tool title="iTerm2">
            I’m honestly not even sure what features I get with this that aren’t
            just part of the macOS Terminal but it’s what I use.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
