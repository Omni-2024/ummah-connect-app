package com.course_service.service.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private String name;
    private String slug;
    private BigDecimal price;
    private BigDecimal discount;
    private boolean discountEnabled;
    private String coverImageUrl;
    private String description;
    private boolean archived;
}

