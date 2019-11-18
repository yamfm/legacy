import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = 'AIzaSyAGHGhZv2TcM0igT7h1vNiS4BZ0bqy-rL8';
const VIDEO_URL = `${ BASE_URL }/videos?part=snippet,contentDetails&key=${ API_KEY }`;

const youtube = {
  video(video_id) {
    return new Promise(async (resolve, reject) => {
      const response = await axios.get(`${ VIDEO_URL }&id=${ video_id }`);
      const { snippet, contentDetails } = response.data.items[0];
      const video = {
        video_id,
        video_title: snippet.title,
        video_description: snippet.description,
        video_published_at: snippet.publishedAt,
        video_thumb: snippet.thumbnails.high.url,
        video_duration: contentDetails.duration,
      }
      resolve(video);
    })
  },
}

export {
  youtube,
}
