package com.sliit.paf.smartcampus;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.data.mongodb.uri=mongodb://localhost:27017/test",
        "spring.data.mongodb.database=test"
})
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
