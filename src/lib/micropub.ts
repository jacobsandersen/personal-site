import { Mf2Object } from "~/content.config";
import { PostType } from "./content";
import { CollectionEntry, getCollection } from "astro:content";
import { discoverPostType } from "./discovery";

type HType = 'h-entry' | 'h-card'

export interface MicropubContent {
  entry: Mf2Object,
  hType: HType,
  postType?: PostType
}

type HFilter = 'none' | HType;
type HEntryFilterMode = 'none' | 'inclusions' | 'exclusions';

export class MicropubContentLoader<HF extends HFilter = 'none', HEFM extends HEntryFilterMode = 'none'> {
  declare private readonly __hFilter: HF
  declare private readonly __hentryFilterMode: HEFM

  private hFilter: HFilter = 'none'
  private contentTypeExclusions: PostType[] = []
  private contentTypeInclusions: PostType[] = []
  private _includeDeleted: boolean = false
  private _sorted: boolean = false
  private _limit: number = -1

  private constructor(from?: MicropubContentLoader<HFilter, HEntryFilterMode>) {
    if (from) {
      this.hFilter = from.hFilter
      this.contentTypeExclusions = from.contentTypeExclusions
      this.contentTypeInclusions = from.contentTypeInclusions
      this._sorted = from._sorted
      this._limit = from._limit
    }
  }

  static create(): MicropubContentLoader<'none', 'none'> {
    return new MicropubContentLoader()
  }

  hType<T extends HFilter>(this: MicropubContentLoader<'none', HEFM>, type: T): MicropubContentLoader<T, HEFM> {
    this.hFilter = type;
    return new MicropubContentLoader<T, HEFM>(this);
  }
  
  excludeContentTypes(this: MicropubContentLoader<'h-entry', 'none' | 'exclusions'>, types: PostType[]): MicropubContentLoader<'h-entry', 'exclusions'> {
    this.contentTypeExclusions.push(...types)
    return new MicropubContentLoader<'h-entry', 'exclusions'>(this)
  }

  includeContentTypes(this: MicropubContentLoader<'h-entry', 'none' | 'inclusions'>, types: PostType[]): MicropubContentLoader<'h-entry', 'inclusions'> {
    this.contentTypeInclusions.push(...types)
    return new MicropubContentLoader<'h-entry', 'inclusions'>(this)
  }

  includeDeleted(this: MicropubContentLoader<'h-entry', HEFM>): MicropubContentLoader<'h-entry', HEFM> {
    this._includeDeleted = true
    return this
  }

  sorted(): MicropubContentLoader<HF, HEFM> {
    this._sorted = true
    return this
  }

  limit(limit: number): MicropubContentLoader<HF, HEFM> {
    this._limit = limit
    return this
  }

  async load(): Promise<MicropubContent[]> {
    let data = await getCollection('micropub')

    if (this._sorted) {
      data = data.sort((a, b) => {
        const aPublished = a.data.properties["published"][0] ?? null;
        const aPublishedType = typeof aPublished;
        const bPublished = b.data.properties["published"][0] ?? null;
        const bPublishedType = typeof bPublished;

        if (aPublishedType !== "string" || bPublishedType !== "string") {
          if (aPublishedType !== "string" && bPublishedType !== "string") {
            return 0;
          }

          return aPublishedType !== "string" ? 1 : -1;
        }

        const aPublishedDt = new Date(aPublished as string);
        const aPublishedValid = !isNaN(aPublishedDt.getTime());
        const bPublishedDt = new Date(bPublished as string);
        const bPublishedValid = !isNaN(bPublishedDt.getTime());

        if (!aPublishedValid || !bPublishedValid) {
          if (!aPublishedValid && !bPublishedValid) {
            return 0;
          }

          return aPublishedValid ? -1 : 1;
        }

        return bPublishedDt.getTime() - aPublishedDt.getTime();
      });
    }
    
    if (this.hFilter !== 'none') {
      data = data.filter(entry => entry.data.type && entry.data.type.length && entry.data.type[0] === this.hFilter)
    }

    let typedData: [CollectionEntry<'micropub'>, PostType | undefined][] = data.map(entry => [
      entry,
      entry.data.type[0] === 'h-entry' ? discoverPostType(entry.data.properties) : undefined
    ])

    let out: MicropubContent[] = []
    if (this.hFilter === 'h-entry') {
      if (this.contentTypeInclusions.length) {
        typedData = typedData.filter(entry => entry[1]).filter(entry => this.contentTypeInclusions.includes(entry[1]!))
      } else if (this.contentTypeExclusions.length) {
        typedData = typedData.filter(entry => entry[1]).filter(entry => !this.contentTypeExclusions.includes(entry[1]!))
      }
    }

    out = typedData.map(entry => ({
      entry: entry[0].data,
      hType: entry[0].data.type[0] as HType,
      postType: entry[1]
    }))

    if (!this._includeDeleted) {
      out = out.filter(post => {
        let deleted = post.entry.properties["deleted"];
        if (!deleted) {
          return true;
        }

        return !deleted[0];
      })
    }

    if (this._limit > 0) {
      out = out.slice(0, this._limit);
    }

    return out
  }
}