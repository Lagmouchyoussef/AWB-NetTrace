package com.awb.backend.roles.technician.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

// Local-disk storage for intervention photos, outside the webroot/classpath so files are only
// ever reachable through the scoped controller endpoint (never served statically). Stored file
// names are always a generated UUID - the original upload name is never trusted as a path
// component (path traversal).
@Component
public class InterventionPhotoStorage {

  private static final Set<String> ALLOWED_CONTENT_TYPES =
      Set.of("image/jpeg", "image/png", "image/webp");

  private final Path rootDir;

  public InterventionPhotoStorage(
      @Value("${app.storage.intervention-photos-dir}") String rootDirPath) {
    this.rootDir = Path.of(rootDirPath).toAbsolutePath().normalize();
    try {
      Files.createDirectories(rootDir);
    } catch (IOException e) {
      throw new UncheckedIOException("Unable to create intervention photos directory", e);
    }
  }

  public String store(MultipartFile file) {
    String contentType = file.getContentType();
    if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Only JPEG, PNG or WebP photos are accepted.");
    }
    String extension = extensionFor(contentType);
    String storedFileName = UUID.randomUUID() + extension;
    Path target = rootDir.resolve(storedFileName);
    try (InputStream in = file.getInputStream()) {
      Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) {
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store the uploaded photo.");
    }
    return storedFileName;
  }

  public byte[] read(String storedFileName) {
    try {
      return Files.readAllBytes(resolveExisting(storedFileName));
    } catch (IOException e) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo file not found.");
    }
  }

  public void delete(String storedFileName) {
    try {
      Files.deleteIfExists(resolveExisting(storedFileName));
    } catch (IOException e) {
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete the stored photo.");
    }
  }

  // Re-derives the path from the root dir and rejects anything that escapes it, even though
  // storedFileName always originates from our own UUID generation, not user input directly.
  private Path resolveExisting(String storedFileName) {
    Path resolved = rootDir.resolve(storedFileName).normalize();
    if (!resolved.startsWith(rootDir)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid photo reference.");
    }
    return resolved;
  }

  private String extensionFor(String contentType) {
    return switch (contentType) {
      case "image/png" -> ".png";
      case "image/webp" -> ".webp";
      default -> ".jpg";
    };
  }
}
