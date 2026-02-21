import { Mf2Properties } from "~/types/mf2-document";
import { PostType } from "./content";
import { extractPostContent, extractPostName, hasPropWithValidUrl, isValidRsvp } from "~/util/mf2-util";
import Mf2Extractor from "./extractor/Mf2Extractor";
import RsvpMf2Extractor from "./extractor/RsvpMf2Extractor";
import RepostMf2Extractor from "./extractor/RepostMf2Extractor";
import LikeMf2Extractor from "./extractor/LikeMf2Extractor";
import ReplyMf2Extractor from "./extractor/ReplyMf2Extractor";
import BookmarkMf2Extractor from "./extractor/BookmarkMf2Extractor";
import PhotoMf2Extractor from "./extractor/PhotoMf2Extractor";
import CheckinMf2Extractor from "./extractor/CheckinMf2Extractor";
import ArticleMf2Extractor from "./extractor/ArticleMf2Extractor";
import NoteMf2Extractor from "./extractor/NoteMf2Extractor";

const determineContentBasedType = (props: Mf2Properties): PostType => {
    const postContent = extractPostContent(props)
    if (!postContent) {
        return 'note'
    }

    const name = extractPostName(props)
    if (!name) {
        return 'note'
    }

    const trimmedName = name.trim().replaceAll(/\s+/g, ' ')
    const trimmedPostContent = postContent.trim().replaceAll(/\s+/g, ' ')
    
    return trimmedPostContent.startsWith(trimmedName) ? 'note' : 'article'
}

export const discoverPostType = (props: Mf2Properties): PostType => {
    if (isValidRsvp(props)) {
        return 'rsvp'
    }

    if (hasPropWithValidUrl(props, 'repost-of')) {
        return 'repost'
    }

    if (hasPropWithValidUrl(props, 'like-of')) {
        return 'like'
    }

    if (hasPropWithValidUrl(props, 'in-reply-to')) {
        return 'reply'
    }

    if (hasPropWithValidUrl(props, 'bookmark-of')) {
        return 'bookmark'
    }

    if (hasPropWithValidUrl(props, 'photo')) {
        return 'photo'
    }

    if (props.checkin) {
        return 'checkin'
    }

    return determineContentBasedType(props)
}

export function getExtractorForType(type: PostType, props: Mf2Properties): Mf2Extractor {
    switch (type) {
        case 'rsvp':
            return new RsvpMf2Extractor(props)
        case 'repost':
            return new RepostMf2Extractor(props)
        case 'like':
            return new LikeMf2Extractor(props)
        case 'reply':
            return new ReplyMf2Extractor(props)
        case 'bookmark':
            return new BookmarkMf2Extractor(props)
        case 'photo':
            return new PhotoMf2Extractor(props)
        case 'checkin':
            return new CheckinMf2Extractor(props)
        case 'article':
            return new ArticleMf2Extractor(props)
        case 'note':
            return new NoteMf2Extractor(props)
    }
}