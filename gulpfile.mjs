// gulpfile.mjs
import gulp from "gulp";
import sharp from "sharp";
import path from "path";
import { Transform } from "stream";

function sharpResizeWebp({ width = 400 } = {}) {
  return new Transform({
    objectMode: true,
    async transform(file, _enc, cb) {
      try {
        if (file.isNull()) return cb(null, file);

        // If file is a stream, buffer it (gulp.src defaults to buffers)
        if (file.isStream()) {
          const chunks = [];
          file.contents.on("data", (c) => chunks.push(c));
          file.contents.on("end", async () => {
            try {
              const buf = Buffer.concat(chunks);
              const out = await sharp(buf)
                .resize({ width, withoutEnlargement: false }) // force 400px, even if smaller
                .webp()
                .toBuffer();

              file.contents = out;
              file.path = path.join(
                path.dirname(file.path),
                `${path.basename(file.path, path.extname(file.path))}.webp`
              );
              cb(null, file);
            } catch (err) {
              cb(err);
            }
          });
          file.contents.on("error", cb);
          return;
        }

        // Buffer case
        const out = await sharp(file.contents)
          .resize({ width, withoutEnlargement: false })
          .webp()
          .toBuffer();

        file.contents = out;
        file.path = path.join(
          path.dirname(file.path),
          `${path.basename(file.path, path.extname(file.path))}.webp`
        );
        cb(null, file);
      } catch (err) {
        cb(err);
      }
    }
  });
}

export const images = () =>
  gulp.src("./images/products/**", { buffer: true })
    .pipe(sharpResizeWebp({ width: 400 }))
    .pipe(gulp.dest("./www/images/products"));

export default images;
