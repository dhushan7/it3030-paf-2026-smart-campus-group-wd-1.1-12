package com.sliit.paf.smartcampus.repository;

import com.sliit.paf.smartcampus.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByTypeContainingIgnoreCase(String type);
}