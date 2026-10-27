"use client";

import { useTrackView, type ActivityPayload } from "./track";

/** For server-rendered pages (e.g. a project page): records the view when it opens. Renders nothing. */
export default function TrackView(props: ActivityPayload) {
  useTrackView(props);
  return null;
}
