Put your profile photo here, e.g. `profile.jpeg`.

Then in `index.html`, find the placeholder block inside the `hero` section:

```html
<div class="hero-photo">
  <span class="hero-photo-label">Add a photo of yourself here</span>
  <span class="hero-photo-hint">...</span>
</div>
```

Replace it with:

```html
<img class="hero-photo" src="assets/profile.jpeg" alt="Cooper Hince">
```

`.hero-photo` already has sizing and a border set in `css/style.css`, so the
image will fill the same space the placeholder used.
