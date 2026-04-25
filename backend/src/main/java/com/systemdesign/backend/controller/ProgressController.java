package com.systemdesign.backend.controller;

import com.systemdesign.backend.model.Progress;
import com.systemdesign.backend.repository.ProgressRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgressController {

    private final ProgressRepository progressRepository;

    public ProgressController(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    @GetMapping("/{username}")
    public List<Progress> getUserProgress(@PathVariable String username) {
        return progressRepository.findByUsername(username);
    }

    @PostMapping
    public Progress saveProgress(@RequestBody Progress progress) {

        return progressRepository
                .findByTopicNameAndUsername(
                        progress.getTopicName(),
                        progress.getUsername()
                )
                .map(existing -> {
                    existing.setCompleted(progress.isCompleted());
                    return progressRepository.save(existing);
                })
                .orElseGet(() -> progressRepository.save(progress));
    }
}