import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { formatDateToISO, formatDateToHuman } from '@/lib/formatDate'

function Article({ article }: { article: Article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/blog/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={formatDateToISO(article.created)}
          className="md:hidden"
          decorate
        >
          {formatDateToHuman(article.created)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={formatDateToISO(article.created)}
        className="mt-1 hidden md:block"
      >
        {formatDateToHuman(article.created)}
      </Card.Eyebrow>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'All of my long-form thoughts on life in the Philippines (especially for expats), software engineering, travel, and more, collected in chronological order.',
}

export default function ArticlesIndex() {
  let articles: Article[] = []

  return (
    <SimpleLayout
      title="Writing on life in the Philippines, software engineering, travel, and more."
      intro="All of my long-form thoughts on life in the Philippines (especially for expats), software engineering, travel, and more, collected in chronological order."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {articles.map((article) => (
            <Article key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
