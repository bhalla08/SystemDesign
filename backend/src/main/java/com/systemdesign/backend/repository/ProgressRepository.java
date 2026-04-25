package com.systemdesign.backend.repository;

import com.systemdesign.backend.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {

    Optional<Progress> findByTopicNameAndUsername(
            String topicName,
            String username
    );

    List<Progress> findByUsername(String username);
}