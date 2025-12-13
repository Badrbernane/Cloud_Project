package com.fantazyteamservice.model;

import com.fantazyteamservice.model. enums.Position;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Position position;

    @Column(nullable = false, length = 100)
    private String club;

    @Column(length = 50)
    private String nationality;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalPoints = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer goals = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer assists = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer cleanSheets = 0;

    @Column(length = 500)
    private String imageUrl;
}