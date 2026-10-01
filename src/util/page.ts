export interface PaginatorData {
  page: number,
  pageLink: (page: number) => string 
}

export function getPaginatorData(url: URL): PaginatorData {
  return {
    page: getPage(url),
    pageLink: getPageLinkFn(url)
  }
}

export function getPage(url: URL): number {
  const page = Number(url.searchParams.get('page') ?? '1')

  if (Number.isNaN(page)) {
    return 1
  } else if (page === 0) {
    return 1
  }

  return page
}

export function getPageLinkFn(url: URL): (page: number) => string {
  return (page: number): string => {
    url.searchParams.set('page', page.toString())
    return url.toString()
  }
}