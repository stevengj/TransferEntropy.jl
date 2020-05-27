using Distances
using NearestNeighbors
using DelayEmbeddings

@testset "Kraskov (kNN) 3D $i" for i in 1:n_realizations
    # Some random points that we embed
    x = rand(100)
    y = rand(100)
    js = (2, 2, 1)
    τs = (1, 0, 0)
    E = genembed([x, y], τs, js)

    # How many neighbors to consider?
    k1 = 2
    k2 = 3
    # Which variables go into which marginals?
    target_future = [1]
    target_presentpast = [2]
    source_presentpast = [3]
    conditioned_presentpast = Int[]

    v = TEVars(target_future,
            target_presentpast,
            source_presentpast,
            conditioned_presentpast)

    @testset "On raw points, default metric" begin
        @test transferentropy_kraskov(pts, k1, k2, v) |> isfinite
        @test transferentropy_kraskov(pts, k1, k2, target_future,
                                                    target_presentpast,
                                                    source_presentpast,
                                                conditioned_presentpast) |> isfinite
    end

    @testset "On embeddings, default metric" begin
        @test transferentropy_kraskov(E, k1, k2, v) |> isfinite
        @test transferentropy_kraskov(E, k1, k2, target_future,
                                                    target_presentpast,
                                                    source_presentpast,
                                                    conditioned_presentpast) |> isfinite
    end

    @testset "On points, specifying the distance metric" begin
        @test transferentropy_kraskov(pts, k1, k2, v; metric = Chebyshev()) |> isfinite
        @test transferentropy_kraskov(pts, k1, k2, v; metric = Chebyshev()) |> isfinite
    end

    @testset "On embeddings, specifying the distance metric" begin
        @test transferentropy_kraskov(pts, k1, k2, v; metric = Chebyshev()) |> isfinite
        @test transferentropy_kraskov(pts, k1, k2, v; metric = Chebyshev()) |> isfinite
        @test transferentropy_kraskov(E, k1, k2, v; metric = Chebyshev()) |> isfinite
        @test transferentropy_kraskov(E, k1, k2, v; metric = Chebyshev()) |> isfinite
    end
end


@testset "Kraskov (kNN) 4D $i" for i in 1:n_realizations
    # Some random points that we embed
    x = rand(100)
    y = rand(100)
    js = (2, 2, 2, 1)
    τs = (1, 0, -1, 0)
    E = genembed([x, y], τs, js)

    # How many neighbors to consider?
    k1 = 2
    k2 = 3
    # Which variables go into which marginals?
    target_future = [1]
    target_presentpast = [2, 3]
    source_presentpast = [4]
    conditioned_presentpast = Int[]

    v = TEVars(target_future,
            target_presentpast,
            source_presentpast,
            conditioned_presentpast)

    @testset "On raw points, default metric" begin
        @test transferentropy_kraskov(pts, k1, k2, v) |> isfinite
        @test transferentropy_kraskov(pts, k1, k2, target_future,
                                                    target_presentpast,
                                                    source_presentpast,
                                                conditioned_presentpast) |> isfinite
    end

    @testset "On embeddings, default metric" begin
        @test transferentropy_kraskov(E, k1, k2, v) |> isfinite
        @test transferentropy_kraskov(E, k1, k2, target_future,
                                                    target_presentpast,
                                                    source_presentpast,
                                                    conditioned_presentpast) |> isfinite
    end

    @testset "On points, specifying the distance metric" begin
        @test transferentropy_kraskov(pts, k1, k2, v; metric = Chebyshev()) |> isfinite
        @test transferentropy_kraskov(pts, k1, k2, v; metric = Chebyshev()) |> isfinite
    end

    @testset "On embeddings, specifying the distance metric" begin
        @test transferentropy_kraskov(pts, k1, k2, v; metric = Chebyshev()) |> isfinite
        @test transferentropy_kraskov(pts, k1, k2, v; metric = Chebyshev()) |> isfinite
        @test transferentropy_kraskov(E, k1, k2, v; metric = Chebyshev()) |> isfinite
        @test transferentropy_kraskov(E, k1, k2, v; metric = Chebyshev()) |> isfinite
    end
end
