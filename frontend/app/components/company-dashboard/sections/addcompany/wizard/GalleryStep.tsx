"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { inputClass } from "./inputClass";
import { galleryImageFields, galleryVideoFields } from "./listFields";
import RepeatableList from "./RepeatableList";
import { initialGalleryImage, initialGalleryVideo, type GalleryImage, type GalleryVideo } from "./wizardData";

/** "Gallery & Media": an introduction, then image and video links. */
export default function GalleryStep({ description, onDescription, images, setImages, videos, setVideos }: {
  description: string; onDescription: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  images: GalleryImage[]; setImages: Dispatch<SetStateAction<GalleryImage[]>>;
  videos: GalleryVideo[]; setVideos: Dispatch<SetStateAction<GalleryVideo[]>>;
}) {
  return (
    <div className="space-y-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
      <div className="rounded-3xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-bold text-gray-900">Gallery Description</h3>
        <p className="mt-2 text-sm text-gray-500">Add a short introduction for the company gallery and showcase section.</p>
        <textarea name="galleryDescription" value={description} onChange={onDescription} rows={4} placeholder="Showcase your best projects, team photos, and company milestones." className={inputClass.replace("mt-2", "mt-4")} />
      </div>
      <RepeatableList surface="white" title="Gallery Images" description="Add multiple image URLs for the public company gallery." addLabel="Add Image" itemLabel="Image" rows={images} setRows={setImages} blank={initialGalleryImage} fields={galleryImageFields} />
      <RepeatableList surface="white" title="Gallery Videos" description="Add multiple video URLs for company introductions and project snippets." addLabel="Add Video" itemLabel="Video" rows={videos} setRows={setVideos} blank={initialGalleryVideo} fields={galleryVideoFields} />
    </div>
  );
}
