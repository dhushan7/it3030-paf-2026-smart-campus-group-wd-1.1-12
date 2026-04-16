package com.sliit.paf.smartcampus.repository;

import com.sliit.paf.smartcampus.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByTypeContainingIgnoreCase(String type);
}