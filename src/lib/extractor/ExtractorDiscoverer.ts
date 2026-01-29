import { Mf2Properties } from "~/types/mf2-document";
import Mf2Extractor from "./Mf2Extractor";
import RsvpMf2Extractor from "./RsvpMf2Extractor";
import RepostMf2Extractor from "./RepostMf2Extractor";
import LikeMf2Extractor from "./LikeMf2Extractor";
import ReplyMf2Extractor from "./ReplyMf2Extractor";
import VideoMf2Extractor from "./VideoMf2Extractor";
import PhotoMf2Extractor from "./PhotoMf2Extractor";
import CheckinMf2Extractor from "./CheckinMf2Extractor";
import NoteMf2Extractor from "./NoteMf2Extractor";
import ArticleMf2Extractor from "./ArticleMf2Extractor";
import { hasPropWithValidUrl, isValidRsvp } from "~/util/mf2-util";

export function discoverExtractor(props: Mf2Properties): Mf2Extractor {
    let extractor: Mf2Extractor
    if (isValidRsvp(props)) {
        extractor = new RsvpMf2Extractor(props)
    } else if (hasPropWithValidUrl(props, 'repost-of')) {
        extractor = new RepostMf2Extractor(props)
    } else if (hasPropWithValidUrl(props, 'like-of')) {
        extractor = new LikeMf2Extractor(props)
    } else if (hasPropWithValidUrl(props, 'in-reply-to')) {
        extractor = new ReplyMf2Extractor(props)
    } else if (hasPropWithValidUrl(props, 'video')) {
        extractor = new VideoMf2Extractor(props)
    } else if (hasPropWithValidUrl(props, 'photo')) {
        extractor = new PhotoMf2Extractor(props)
    } else if (props.checkin) {
        extractor = new CheckinMf2Extractor(props)
    } else {
        let postContent = ""
        
        if (props.content && props.content.length > 0) {
            for (let item of props.content) {
                if (typeof item === 'string' && item.length > 0) {
                    postContent = item
                    break
                } else if (typeof item === 'object' && item !== null && 'html' in item) {
                    const html = (item as any).html
                    if (typeof html === 'string' && html.length > 0) {
                        postContent = html
                        break
                    }
                }
            }
        } else if (props.summary && props.summary.length > 0) {
            for (let item of props.summary) {
                if (typeof item === 'string' && item.length > 0) {
                    postContent = item
                    break
                }
            }
        }

        if (postContent) {
            let name = ""
            if (props.name) {
                for (let item of props.name) {
                    if (typeof item === 'string' && item.length > 0) {
                        name = item
                        break
                    }
                }
            }

            if (name) {
                name = name.trim().replaceAll(/\s+/g, ' ')
                props.name = [name]

                postContent = postContent.trim().replaceAll(/\s+/g, ' ')
                if (postContent.startsWith(name)) {
                    extractor = new NoteMf2Extractor(props)
                } else {
                    extractor = new ArticleMf2Extractor(props)
                }
            } else {
                extractor = new NoteMf2Extractor(props)
            }
        } else {
            extractor = new NoteMf2Extractor(props)
        }
    }
    return extractor
}