package com.sace.repository;

import com.sace.entity.Submission;
import com.sace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByUser(User user);

    Optional<Submission> findByUserAndId(User user, Long id);

    List<Submission> findByUserAndStatus(User user, Submission.SubmissionStatus status);
}
