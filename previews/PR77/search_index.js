var documenterSearchIndex = {"docs":
[{"location":"dataset/","page":"Datasets","title":"Datasets","text":"Dataset","category":"page"},{"location":"dataset/#DelayEmbeddings.Dataset","page":"Datasets","title":"DelayEmbeddings.Dataset","text":"Dataset{D, T} <: AbstractDataset{D,T}\n\nA dedicated interface for datasets. It contains equally-sized datapoints of length D, represented by SVector{D, T}. These data are contained in the field .data of a dataset, as a standard Julia Vector{SVector}.\n\nWhen indexed with 1 index, a dataset is like a vector of datapoints. When indexed with 2 indices it behaves like a matrix that has each of the columns be the timeseries of each of the variables.\n\nDataset also supports most sensible operations like append!, push!, hcat, eachrow, among others, and when iterated over, it iterates over its contained points.\n\nDescription of indexing\n\nIn the following let i, j be integers,  typeof(data) <: AbstractDataset and v1, v2 be <: AbstractVector{Int} (v1, v2 could also be ranges, and for massive performance benefits make v2 an SVector{X, Int}).\n\ndata[i] == data[i, :] gives the ith datapoint (returns an SVector)\ndata[v1] == data[v1, :], returns a Dataset with the points in those indices.\ndata[:, j] gives the jth variable timeseries, as Vector\ndata[v1, v2], data[:, v2] returns a Dataset with the appropriate entries (first indices being \"time\"/point index, while second being variables)\ndata[i, j] value of the jth variable, at the ith timepoint\n\nUse Matrix(dataset) or Dataset(matrix) to convert. It is assumed that each column of the matrix is one variable. If you have various timeseries vectors x, y, z, ... pass them like Dataset(x, y, z, ...). You can use columns(dataset) to obtain the reverse, i.e. all columns of the dataset in a tuple.\n\n\n\n\n\n","category":"type"},{"location":"mutualinfo/","page":"Mutual information","title":"Mutual information","text":"mutualinfo","category":"page"},{"location":"mutualinfo/#TransferEntropy.mutualinfo","page":"Mutual information","title":"TransferEntropy.mutualinfo","text":"mutualinfo(x, y, est; base = 2, q = 1)\n\nEstimate mutual information between x and y, I^q(x y), using the provided  entropy/probability estimator est from Entropies.jl, and Rényi entropy of order q (defaults to q = 1, which is the Shannon entropy), with logarithms to the given base.\n\nBoth x and y can be vectors or (potentially multivariate) Datasets.\n\nWorth highlighting here are the estimators that compute entropies directly, e.g. nearest-neighbor based methhods. The choice is between naive  estimation using the KozachenkoLeonenko or Kraskov entropy estimators,  or the improved Kraskov1 and Kraskov2 dedicated I estimators. The  latter estimators reduce bias compared to the naive estimators.\n\nNote: only Shannon entropy is possible to use for nearest neighbor estimators, so the  keyword q cannot be provided; it is hardcoded as q = 1. \n\nDescription\n\nMutual information I between (potentially collections of) variables X and Y  is defined as \n\nI(X Y) = sum_y in Y sum_x in X p(x y) log left( dfracp(x y)p(x)p(y) right)\n\nHere, we rewrite this expression as the sum of the marginal entropies, and extend the  definition of I to use generalized Rényi entropies\n\nI^q(X Y) = H^q(X) + H^q(Y) - H^q(X Y)\n\nwhere H^q(cdot) is the generalized Renyi entropy of order q.\n\n\n\n\n\n","category":"function"},{"location":"#TransferEntropy.jl","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"","category":"section"},{"location":"#Exported-functions","page":"TransferEntropy.jl","title":"Exported functions","text":"","category":"section"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"This package exports two functions, transferentropy and mutualinfo.","category":"page"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"In order to compute either quantity, combine your input data with one of the available  estimators. Docstrings for transferentropy and  mutualinfo give overviews of currently implemented estimators for either  function.","category":"page"},{"location":"#estimators","page":"TransferEntropy.jl","title":"Estimators","text":"","category":"section"},{"location":"#Binning-based","page":"TransferEntropy.jl","title":"Binning based","text":"","category":"section"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"VisitationFrequency\nTransferOperator\nRectangularBinning","category":"page"},{"location":"#Entropies.VisitationFrequency","page":"TransferEntropy.jl","title":"Entropies.VisitationFrequency","text":"VisitationFrequency(r::RectangularBinning) <: BinningProbabilitiesEstimator\n\nA probability estimator based on binning data into rectangular boxes dictated by the binning scheme r.\n\nExample\n\n# Construct boxes by dividing each coordinate axis into 5 equal-length chunks.\nb = RectangularBinning(5)\n\n# A probabilities estimator that, when applied a dataset, computes visitation frequencies\n# over the boxes of the binning\nest = VisitationFrequency(b)\n\nSee also: RectangularBinning.\n\n\n\n\n\n","category":"type"},{"location":"#Entropies.TransferOperator","page":"TransferEntropy.jl","title":"Entropies.TransferOperator","text":"TransferOperator(ϵ::RectangularBinning) <: BinningProbabilitiesEstimator\n\nA probability estimator based on binning data into rectangular boxes dictated by  the binning scheme ϵ, then approxmating the transfer (Perron-Frobenius) operator  over the bins, then taking the invariant measure associated with that transfer operator  as the bin probabilities. Assumes that the input data are sequential (time-ordered).\n\nThis implementation follows the grid estimator approach in Diego et al. (2019)[Diego2019].\n\nDescription\n\nThe transfer operator P^Nis computed as an N-by-N matrix of transition  probabilities between the states defined by the partition elements, where N is the  number of boxes in the partition that is visited by the orbit/points. \n\nIf  x_t^(D) _n=1^L are the L different D-dimensional points over  which the transfer operator is approximated,  C_k=1^N  are the N different  partition elements (as dictated by ϵ) that gets visited by the points, and  phi(x_t) = x_t+1, then\n\nP_ij = dfrac\n x_n  phi(x_n) in C_j cap x_n in C_i \n x_m  x_m in C_i \n\nwhere  denotes the cardinal. The element P_ij thus indicates how many points  that are initially in box C_i end up in box C_j when the points in C_i are  projected one step forward in time. Thus, the row P_ik^N where  k in 1 2 ldots N  gives the probability  of jumping from the state defined by box C_i to any of the other N states. It  follows that sum_k=1^N P_ik = 1 for all i. Thus, P^N is a row/right  stochastic matrix.\n\nInvariant measure estimation from transfer operator\n\nThe left invariant distribution mathbfrho^N is a row vector, where  mathbfrho^N P^N = mathbfrho^N. Hence, mathbfrho^N is a row  eigenvector of the transfer matrix P^N associated with eigenvalue 1. The distribution  mathbfrho^N approximates the invariant density of the system subject to the  partition ϵ, and can be taken as a probability distribution over the partition elements.\n\nIn practice, the invariant measure mathbfrho^N is computed using  invariantmeasure, which also approximates the transfer matrix. The invariant distribution is initialized as a length-N random distribution which is then applied to P^N.  The resulting length-N distribution is then applied to P^N again. This process  repeats until the difference between the distributions over consecutive iterations is  below some threshold. \n\nProbability and entropy estimation\n\nprobabilities(x::AbstractDataset, est::TransferOperator{RectangularBinning}) estimates    probabilities for the bins defined by the provided binning (est.ϵ)\ngenentropy(x::AbstractDataset, est::TransferOperator{RectangularBinning}) does the same,    but computes generalized entropy using the probabilities.\n\nSee also: RectangularBinning, invariantmeasure.\n\n[Diego2019]: Diego, D., Haaga, K. A., & Hannisdal, B. (2019). Transfer entropy computation using the Perron-Frobenius operator. Physical Review E, 99(4), 042212.\n\n\n\n\n\n","category":"type"},{"location":"#Entropies.RectangularBinning","page":"TransferEntropy.jl","title":"Entropies.RectangularBinning","text":"RectangularBinning(ϵ) <: RectangularBinningScheme\n\nInstructions for creating a rectangular box partition using the binning scheme ϵ.  Binning instructions are deduced from the type of ϵ.\n\nRectangular binnings may be automatically adjusted to the data in which the RectangularBinning  is applied, as follows:\n\nϵ::Int divides each coordinate axis into ϵ equal-length intervals,   extending the upper bound 1/100th of a bin size to ensure all points are covered.\nϵ::Float64 divides each coordinate axis into intervals of fixed size ϵ, starting   from the axis minima until the data is completely covered by boxes.\nϵ::Vector{Int} divides the i-th coordinate axis into ϵ[i] equal-length   intervals, extending the upper bound 1/100th of a bin size to ensure all points are   covered.\nϵ::Vector{Float64} divides the i-th coordinate axis into intervals of fixed size ϵ[i], starting   from the axis minima until the data is completely covered by boxes.\n\nRectangular binnings may also be specified on arbitrary min-max ranges. \n\nϵ::Tuple{Vector{Tuple{Float64,Float64}},Int64} creates intervals   along each coordinate axis from ranges indicated by a vector of (min, max) tuples, then divides   each coordinate axis into an integer number of equal-length intervals. Note: this does not ensure   that all points are covered by the data (points outside the binning are ignored).\n\nExample 1: Grid deduced automatically from data (partition guaranteed to cover data points)\n\nFlexible box sizes\n\nThe following binning specification finds the minima/maxima along each coordinate axis, then  split each of those data ranges (with some tiny padding on the edges) into 10 equal-length  intervals. This gives (hyper-)rectangular boxes, and works for data of any dimension.\n\nusing Entropies\nRectangularBinning(10)\n\nNow, assume the data consists of 2-dimensional points, and that we want a finer grid along one of the dimensions than over the other dimension.\n\nThe following binning specification finds the minima/maxima along each coordinate axis, then  splits the range along the first coordinate axis (with some tiny padding on the edges)  into 10 equal-length intervals, and the range along the second coordinate axis (with some  tiny padding on the edges) into 5 equal-length intervals. This gives (hyper-)rectangular boxes.\n\nusing Entropies\nRectangularBinning([10, 5])\n\nFixed box sizes\n\nThe following binning specification finds the minima/maxima along each coordinate axis,  then split the axis ranges into equal-length intervals of fixed size 0.5 until the all data  points are covered by boxes. This approach yields (hyper-)cubic boxes, and works for  data of any dimension.\n\nusing Entropies\nRectangularBinning(0.5)\n\nAgain, assume the data consists of 2-dimensional points, and that we want a finer grid along one of the dimensions than over the other dimension.\n\nThe following binning specification finds the minima/maxima along each coordinate axis, then splits the range along the first coordinate axis into equal-length intervals of size 0.3, and the range along the second axis into equal-length intervals of size 0.1 (in both cases,  making sure the data are completely covered by the boxes). This approach gives a (hyper-)rectangular boxes. \n\nusing Entropies\nRectangularBinning([0.3, 0.1])\n\nExample 2: Custom grids (partition not guaranteed to cover data points):\n\nAssume the data consists of 3-dimensional points (x, y, z), and that we want a grid  that is fixed over the intervals [x₁, x₂] for the first dimension, over [y₁, y₂] for the second dimension, and over [z₁, z₂] for the third dimension. We when want to split each of those ranges into 4 equal-length pieces. Beware: some points may fall  outside the partition if the intervals are not chosen properly (these points are  simply discarded). \n\nThe following binning specification produces the desired (hyper-)rectangular boxes. \n\nusing Entropies, DelayEmbeddings\n\nD = Dataset(rand(100, 3));\n\nx₁, x₂ = 0.5, 1 # not completely covering the data, which are on [0, 1]\ny₁, y₂ = -2, 1.5 # covering the data, which are on [0, 1]\nz₁, z₂ = 0, 0.5 # not completely covering the data, which are on [0, 1]\n\nϵ = [(x₁, x₂), (y₁, y₂), (z₁, z₂)], 4 # [interval 1, interval 2, ...], n_subdivisions\n\nRectangularBinning(ϵ)\n\n\n\n\n\n","category":"type"},{"location":"#Kernel-density-based","page":"TransferEntropy.jl","title":"Kernel density based","text":"","category":"section"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"NaiveKernel","category":"page"},{"location":"#Entropies.NaiveKernel","page":"TransferEntropy.jl","title":"Entropies.NaiveKernel","text":"NaiveKernel(ϵ::Real, ss = KDTree; w = 0, metric = Euclidean()) <: ProbabilitiesEstimator\n\nEstimate probabilities/entropy using a \"naive\" kernel density estimation approach (KDE), as  discussed in Prichard and Theiler (1995) [PrichardTheiler1995].\n\nProbabilities P(mathbfx epsilon) are assigned to every point mathbfx by  counting how many other points occupy the space spanned by  a hypersphere of radius ϵ around mathbfx, according to:\n\nP_i( X epsilon) approx dfrac1N sum_s B(X_i - X_j  epsilon)\n\nwhere B gives 1 if the argument is true. Probabilities are then normalized.\n\nThe search structure ss is any search structure supported by Neighborhood.jl. Specifically, use KDTree to use a tree-based neighbor search, or BruteForce for the direct distances between all points. KDTrees heavily outperform direct distances when the dimensionality of the data is much smaller than the data length.\n\nThe keyword w stands for the Theiler window, and excludes indices s that are within i - s  w from the given point X_i.\n\n[PrichardTheiler1995]: Prichard, D., & Theiler, J. (1995). Generalized redundancies for time series analysis. Physica D: Nonlinear Phenomena, 84(3-4), 476-493.\n\n\n\n\n\n","category":"type"},{"location":"#Nearest-neighbor-based","page":"TransferEntropy.jl","title":"Nearest neighbor based","text":"","category":"section"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"KozachenkoLeonenko\nKraskov\nKraskov1\nKraskov2","category":"page"},{"location":"#Entropies.KozachenkoLeonenko","page":"TransferEntropy.jl","title":"Entropies.KozachenkoLeonenko","text":"KozachenkoLeonenko(; k::Int = 1, w::Int = 0) <: EntropyEstimator\n\nEntropy estimator based on nearest neighbors. This implementation is based on Kozachenko & Leonenko (1987)[KozachenkoLeonenko1987], as described in Charzyńska and Gambin (2016)[Charzyńska2016].\n\nw is the Theiler window (defaults to 0, meaning that only the point itself is excluded when searching for neighbours).\n\ninfo: Info\nThis estimator is only available for entropy estimation. Probabilities cannot be obtained directly.\n\n[Charzyńska2016]: Charzyńska, A., & Gambin, A. (2016). Improvement of the k-NN entropy estimator with applications in systems biology. Entropy, 18(1), 13.\n\n[KozachenkoLeonenko1987]: Kozachenko, L. F., & Leonenko, N. N. (1987). Sample estimate of the entropy of a random vector. Problemy Peredachi Informatsii, 23(2), 9-16.\n\n\n\n\n\n","category":"type"},{"location":"#Entropies.Kraskov","page":"TransferEntropy.jl","title":"Entropies.Kraskov","text":"k-th nearest neighbour(kNN) based\n\nKraskov(; k::Int = 1, w::Int = 0) <: EntropyEstimator\n\nEntropy estimator based on k-th nearest neighbor searches[Kraskov2004]. w is the Theiler window.\n\ninfo: Info\nThis estimator is only available for entropy estimation.  Probabilities cannot be obtained directly.\n\n[Kraskov2004]: Kraskov, A., Stögbauer, H., & Grassberger, P. (2004). Estimating mutual information. Physical review E, 69(6), 066138.\n\n\n\n\n\n","category":"type"},{"location":"#TransferEntropy.Kraskov1","page":"TransferEntropy.jl","title":"TransferEntropy.Kraskov1","text":"Kraskov1(k::Int = 1; metric_x = Chebyshev(), metric_y = Chebyshev()) <: MutualInformationEstimator\n\nThe I^(1) nearest neighbor based mutual information estimator from  Kraskov et al. (2004), using k nearest neighbors. The distance metric for  the marginals x and y can be chosen separately, while the Chebyshev metric  is always used for the z = (x, y) joint space.\n\n\n\n\n\n","category":"type"},{"location":"#TransferEntropy.Kraskov2","page":"TransferEntropy.jl","title":"TransferEntropy.Kraskov2","text":"Kraskov2(k::Int = 1; metric_x = Chebyshev(), metric_y = Chebyshev()) <: MutualInformationEstimator\n\nThe I^(2)(x y) nearest neighbor based mutual information estimator from  Kraskov et al. (2004), using k nearest neighbors. The distance metric for  the marginals x and y can be chosen separately, while the Chebyshev metric  is always used for the z = (x, y) joint space.\n\n\n\n\n\n","category":"type"},{"location":"#Permutation-based","page":"TransferEntropy.jl","title":"Permutation based","text":"","category":"section"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"SymbolicPermutation","category":"page"},{"location":"#Entropies.SymbolicPermutation","page":"TransferEntropy.jl","title":"Entropies.SymbolicPermutation","text":"SymbolicPermutation(; τ = 1, m = 3, lt = Entropies.isless_rand) <: ProbabilityEstimator\nSymbolicWeightedPermutation(; τ = 1, m = 3, lt = Entropies.isless_rand) <: ProbabilityEstimator\nSymbolicAmplitudeAwarePermutation(; τ = 1, m = 3, A = 0.5, lt = Entropies.isless_rand) <: ProbabilityEstimator\n\nSymbolic, permutation-based probabilities/entropy estimators. m is the permutation order (or the symbol size or the embedding dimension) and  τ is the delay time (or lag).\n\nRepeated values during symbolization\n\nIn the original implementation of permutation entropy [BandtPompe2002], equal values are ordered after their order of appearance, but this can lead to erroneous temporal correlations, especially for data with low-amplitude resolution [Zunino2017]. Here, we resolve this issue by letting the user provide a custom \"less-than\" function. The keyword lt accepts a function that decides which of two state vector elements are smaller. If two elements are equal, the default behaviour is to randomly assign one of them as the largest (lt = Entropies.isless_rand). For data with low amplitude resolution, computing probabilities multiple times using the random approach may reduce these erroneous effects.\n\nTo get the behaviour described in Bandt and Pompe (2002), use lt = Base.isless).\n\nProperties of original signal preserved\n\nSymbolicPermutation: Preserves ordinal patterns of state vectors (sorting information). This   implementation is based on Bandt & Pompe et al. (2002)[BandtPompe2002] and   Berger et al. (2019) [Berger2019].\nSymbolicWeightedPermutation: Like SymbolicPermutation, but also encodes amplitude   information by tracking the variance of the state vectors. This implementation is based   on Fadlallah et al. (2013)[Fadlallah2013].\nSymbolicAmplitudeAwarePermutation: Like SymbolicPermutation, but also encodes   amplitude information by considering a weighted combination of absolute amplitudes   of state vectors, and relative differences between elements of state vectors. See   description below for explanation of the weighting parameter A. This implementation   is based on Azami & Escudero (2016) [Azami2016].\n\nProbability estimation\n\nUnivariate time series\n\nTo estimate probabilities or entropies from univariate time series, use the following methods:\n\nprobabilities(x::AbstractVector, est::SymbolicProbabilityEstimator). Constructs state vectors   from x using embedding lag τ and embedding dimension m, symbolizes state vectors,   and computes probabilities as (weighted) relative frequency of symbols.\ngenentropy(x::AbstractVector, est::SymbolicProbabilityEstimator; α=1, base = 2) computes   probabilities by calling probabilities(x::AbstractVector, est),   then computer the order-α generalized entropy to the given base.\n\nSpeeding up repeated computations\n\nA pre-allocated integer symbol array s can be provided to save some memory allocations if the probabilities are to be computed for multiple data sets.\n\nNote: it is not the array that will hold the final probabilities that is pre-allocated, but the temporary integer array containing the symbolized data points. Thus, if provided, it is required that length(x) == length(s) if x is a Dataset, or length(s) == length(x) - (m-1)τ if x is a univariate signal that is to be embedded first.\n\nUse the following signatures (only works for SymbolicPermutation).\n\nprobabilities!(s::Vector{Int}, x::AbstractVector, est::SymbolicPermutation) → ps::Probabilities\nprobabilities!(s::Vector{Int}, x::AbstractDataset, est::SymbolicPermutation) → ps::Probabilities\n\nMultivariate datasets\n\nAlthough not dealt with in the original paper describing the estimators, numerically speaking, permutation entropies can also be computed for multivariate datasets with dimension ≥ 2 (but see caveat below). Such datasets may be, for example, preembedded time series. Then, just skip the delay reconstruction step, compute and symbols directly from the L existing state vectors mathbfx_1 mathbfx_2 ldots mathbfx_L.\n\nprobabilities(x::AbstractDataset, est::SymbolicProbabilityEstimator). Compute ordinal patterns of the   state vectors of x directly (without doing any embedding), symbolize those patterns,   and compute probabilities as (weighted) relative frequencies of symbols.\ngenentropy(x::AbstractDataset, est::SymbolicProbabilityEstimator). Computes probabilities from   symbol frequencies using probabilities(x::AbstractDataset, est::SymbolicProbabilityEstimator),   then computes the order-α generalized (permutation) entropy to the given base.\n\nCaveat: A dynamical interpretation of the permutation entropy does not necessarily hold if computing it on generic multivariate datasets. Method signatures for Datasets are provided for convenience, and should only be applied if you understand the relation between your input data, the numerical value for the permutation entropy, and its interpretation.\n\nDescription\n\nAll symbolic estimators use the same underlying approach to estimating probabilities.\n\nEmbedding, ordinal patterns and symbolization\n\nConsider the n-element univariate time series x(t) = x_1 x_2 ldots x_n. Let mathbfx_i^m tau = x_j x_j+tau ldots x_j+(m-1)tau for j = 1 2 ldots n - (m-1)tau be the i-th state vector in a delay reconstruction with embedding dimension m and reconstruction lag tau. There are then N = n - (m-1)tau state vectors.\n\nFor an m-dimensional vector, there are m possible ways of sorting it in ascending order of magnitude. Each such possible sorting ordering is called a motif. Let pi_i^m tau denote the motif associated with the m-dimensional state vector mathbfx_i^m tau, and let R be the number of distinct motifs that can be constructed from the N state vectors. Then there are at most R motifs; R = N precisely when all motifs are unique, and R = 1 when all motifs are the same.\n\nEach unique motif pi_i^m tau can be mapped to a unique integer symbol 0 leq s_i leq M-1. Let S(pi)  mathbbR^m to mathbbN_0 be the function that maps the motif pi to its symbol s, and let Pi denote the set of symbols Pi =  s_i _iin  1 ldots R.\n\nProbability computation\n\nSymbolicPermutation\n\nThe probability of a given motif is its frequency of occurrence, normalized by the total number of motifs (with notation from [Fadlallah2013]),\n\np(pi_i^m tau) = dfracsum_k=1^N mathbf1_uS(u) = s_i left(mathbfx_k^m tau right) sum_k=1^N mathbf1_uS(u) in Pi left(mathbfx_k^m tau right) = dfracsum_k=1^N mathbf1_uS(u) = s_i left(mathbfx_k^m tau right) N\n\nwhere the function mathbf1_A(u) is the indicator function of a set A. That     is, mathbf1_A(u) = 1 if u in A, and mathbf1_A(u) = 0 otherwise.\n\nSymbolicAmplitudeAwarePermutation\n\nAmplitude-aware permutation entropy is computed analogously to regular permutation entropy but probabilities are weighted by amplitude information as follows.\n\np(pi_i^m tau) = dfracsum_k=1^N mathbf1_uS(u) = s_i left( mathbfx_k^m tau right)  a_ksum_k=1^N mathbf1_uS(u) in Pi left( mathbfx_k^m tau right) a_k = dfracsum_k=1^N mathbf1_uS(u) = s_i left( mathbfx_k^m tau right)  a_ksum_k=1^N a_k\n\nThe weights encoding amplitude information about state vector mathbfx_i = (x_1^i x_2^i ldots x_m^i) are\n\na_i = dfracAm sum_k=1^m x_k^i  + dfrac1-Ad-1 sum_k=2^d x_k^i - x_k-1^i\n\nwith 0 leq A leq 1. When A=0 , only internal differences between the elements of mathbfx_i are weighted. Only mean amplitude of the state vector elements are weighted when A=1. With, 0A1, a combined weighting is used.\n\nSymbolicWeightedPermutation\n\nWeighted permutation entropy is also computed analogously to regular permutation entropy, but adds weights that encode amplitude information too:\n\np(pi_i^m tau) = dfracsum_k=1^N mathbf1_uS(u) = s_i\nleft( mathbfx_k^m tau right)\n w_ksum_k=1^N mathbf1_uS(u) in Pi\nleft( mathbfx_k^m tau right) w_k = dfracsum_k=1^N\nmathbf1_uS(u) = s_i\nleft( mathbfx_k^m tau right)  w_ksum_k=1^N w_k\n\nThe weighted permutation entropy is equivalent to regular permutation entropy when weights are positive and identical (w_j = beta  forall  j leq N and beta  0). Weights are dictated by the variance of the state vectors.\n\nLet the aritmetic mean of state vector mathbfx_i be denoted by\n\nmathbfhatx_j^m tau = frac1m sum_k=1^m x_j + (k+1)tau\n\nWeights are then computed as\n\nw_j = dfrac1msum_k=1^m (x_j+(k+1)tau - mathbfhatx_j^m tau)^2\n\nNote: in equation 7, section III, of the original paper, the authors write\n\nw_j = dfrac1msum_k=1^m (x_j-(k-1)tau - mathbfhatx_j^m tau)^2\n\nBut given the formula they give for the arithmetic mean, this is not the variance of mathbfx_i, because the indices are mixed: x_j+(k-1)tau in the weights formula, vs. x_j+(k+1)tau in the arithmetic mean formula. This seems to imply that amplitude information about previous delay vectors are mixed with mean amplitude information about current vectors. The authors also mix the terms \"vector\" and \"neighboring vector\" (but uses the same notation for both), making it hard to interpret whether the sign switch is a typo or intended. Here, we use the notation above, which actually computes the variance for mathbfx_i.\n\n[BandtPompe2002]: Bandt, Christoph, and Bernd Pompe. \"Permutation entropy: a natural complexity measure for time series.\" Physical review letters 88.17 (2002): 174102.\n\n[Berger2019]: Berger, Sebastian, et al. \"Teaching Ordinal Patterns to a Computer: Efficient Encoding Algorithms Based on the Lehmer Code.\" Entropy 21.10 (2019): 1023.\n\n[Fadlallah2013]: Fadlallah, Bilal, et al. \"Weighted-permutation entropy: A complexity measure for time series incorporating amplitude information.\" Physical Review E 87.2 (2013): 022911.\n\n[Rényi1960]: A. Rényi, Proceedings of the fourth Berkeley Symposium on Mathematics, Statistics and Probability, pp 547 (1960)\n\n[Azami2016]: Azami, H., & Escudero, J. (2016). Amplitude-aware permutation entropy: Illustration in spike detection and signal segmentation. Computer methods and programs in biomedicine, 128, 40-51.\n\n[Fadlallah2013]: Fadlallah, Bilal, et al. \"Weighted-permutation entropy: A complexity measure for time series incorporating amplitude information.\" Physical Review E 87.2 (2013): 022911.\n\n[Zunino2017]: Zunino, L., Olivares, F., Scholkmann, F., & Rosso, O. A. (2017). Permutation entropy based time series analysis: Equalities in the input signal can lead to false conclusions. Physics Letters A, 381(22), 1883-1892.\n\n\n\n\n\n","category":"type"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"There is a possible performance optimization to be made with this method:","category":"page"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"transferentropy!(symb_s, symb_t, s, t, [c], est::SymbolicPermutation; \n        base = 2, q = 1, m::Int = 3, τ::Int = 1, ...) → Float64","category":"page"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"You can optionally provide pre-allocated (integer) symbol vectors symb_s and symb_t (and symb_c), where length(symb_s) == length(symb_t) == length(symb_c) == N - (est.m-1)*est.τ. This is useful for saving  memory allocations for repeated computations.","category":"page"},{"location":"#Hilbert","page":"TransferEntropy.jl","title":"Hilbert","text":"","category":"section"},{"location":"","page":"TransferEntropy.jl","title":"TransferEntropy.jl","text":"Hilbert\nAmplitude\nPhase","category":"page"},{"location":"#TransferEntropy.Hilbert","page":"TransferEntropy.jl","title":"TransferEntropy.Hilbert","text":"Hilbert(est; \n    source::InstantaneousSignalProperty = Phase(),\n    target::InstantaneousSignalProperty = Phase(),\n    cond::InstantaneousSignalProperty = Phase())\n) <: TransferEntropyEstimator\n\nCompute transfer entropy on instantaneous phases/amplitudes of relevant signals, which are  obtained by first applying the Hilbert transform to each signal, then extracting the  phases/amplitudes of the resulting complex numbers[Palus2014]. Original time series are  thus transformed to instantaneous phase/amplitude time series. Transfer  entropy is then estimated using the provided est on those phases/amplitudes (use e.g.  VisitationFrequency, or SymbolicPermutation).\n\ninfo: Info\nDetails on estimation of the transfer entropy (conditional mutual information)  following the phase/amplitude extraction step is not given in Palus (2014). Here,  after instantaneous phases/amplitudes have been obtained, these are treated as regular  time series, from which transfer entropy is then computed as usual.\n\nSee also: Phase, Amplitude.\n\n[Palus2014]: Paluš, M. (2014). Cross-scale interactions and information transfer. Entropy, 16(10), 5263-5289.\n\n\n\n\n\n","category":"type"},{"location":"#TransferEntropy.Amplitude","page":"TransferEntropy.jl","title":"TransferEntropy.Amplitude","text":"Amplitude <: InstantaneousSignalProperty\n\nIndicates that the instantaneous amplitudes of a signal should be used. \n\n\n\n\n\n","category":"type"},{"location":"#TransferEntropy.Phase","page":"TransferEntropy.jl","title":"TransferEntropy.Phase","text":"Phase <: InstantaneousSignalProperty\n\nIndicates that the instantaneous phases of a signal should be used. \n\n\n\n\n\n","category":"type"},{"location":"transferentropy/","page":"Transfer entropy","title":"Transfer entropy","text":"transferentropy","category":"page"},{"location":"transferentropy/#TransferEntropy.transferentropy","page":"Transfer entropy","title":"TransferEntropy.transferentropy","text":"transferentropy(s, t, [c], est; base = 2, q = 1, \n    τT = -1, τS = -1, η𝒯 = 1, dT = 1, dS = 1, d𝒯 = 1, [τC = -1, dC = 1]\n)\n\nEstimate transfer entropy[Schreiber2000] from source s to target t, TE^q(s to t), using the  provided entropy/probability estimator est with logarithms to the given base. Optionally, condition  on c and estimate the conditional transfer entropy TE^q(s to t  c). The input series s, t, and c must be equal-length real-valued vectors.\n\nCompute either Shannon transfer entropy (q = 1, which is the default) or the order-q  Rényi transfer entropy[Jizba2012] by setting q different from 1.\n\nAll possible estimators that can be used are described in the online documentation.\n\nKeyword Arguments\n\nKeyword arguments tune the embedding that will be done to each of the timeseries (with more details following below). In short, the embedding lags τT, τS, τC must be zero or negative, the  prediction lag η𝒯 must be positive, and the embedding dimensions dT, dS, dC, d𝒯  must be greater than or equal to 1. Thus, the convention is to use negative lags to  indicate embedding delays for past state vectors (for the T, S and C marginals,  detailed below), and positive lags to indicate embedding delays for future state vectors  (for the mathcal T marginal, also detailed below). \n\nThe default behaviour is to use scalar timeseries (no embedding, i.e., d = 1 everywhere) for each marginal (in that case, the τT, τS or τC does not affect the analysis).\n\nDescription\n\nTransfer entropy on scalar time series\n\nTransfer entropy[Schreiber2000] between two simultaneously measured scalar time series s(n) and t(n),   s(n) =  s_1 s_2 ldots s_N  and t(n) =  t_1 t_2 ldots t_N , is is defined as \n\nTE(s to t) = sum_i p(s_i t_i t_i+eta) log left( dfracp(t_i+eta  t_i s_i)p(t_i+eta  t_i) right)\n\nTransfer entropy on generalized embeddings\n\nBy defining the vector-valued time series, it is possible to include more than one  historical/future value for each marginal (see 'Uniform vs. non-uniform embeddings' below for embedding details):\n\nmathcalT^(d_mathcal T eta_mathcal T) = t_i^(d_mathcal T eta_mathcal T) _i=1^N, \nT^(d_T tau_T) = t_i^(d_T tau_T) _i=1^N, \nS^(d_S tau_S) = s_i^(d_T tau_T) _i=1^N,  and \nC^(d_C tau_C) = s_i^(d_C tau_C) _i=1^N.\n\nThe non-conditioned generalized and conditioned generalized forms of the transfer entropy are then\n\nTE(s to t) = sum_i p(ST mathcalT) log left( dfracp(mathcalT  T S)p(mathcalT  T) right)\n\nTE(s to t  c) = sum_i p(ST mathcalT C) log left( dfracp(mathcalT  T S C)p(mathcalT  T C) right)\n\nUniform vs. non-uniform embeddings\n\nThe N state vectors for each marginal are either \n\nuniform, of the form x_i^(d omega) = (x_i x_i+omega x_i+2omega ldots x_i+(d - 1)omega),    with equally spaced state vector entries. Note: When constructing marginals for T, S and C,    we need omega leq 0 to get present/past values, while omega  0 is necessary to get future states    when constructing mathcalT.\nnon-uniform, of the form x_i^(d omega) = (x_i x_i+omega_1 x_i+omega_2 ldots x_i+omega_d),   with non-equally spaced state vector entries omega_1 omega_2 ldots omega_d,   which can be freely chosen. Note: When constructing marginals for T, S and C,    we need omega_i leq 0 for all omega_i to get present/past values, while omega_i  0 for all omega_i    is necessary to get future states when constructing mathcalT.\n\nIn practice, the dT-dimensional, dS-dimensional and dC-dimensional state vectors  comprising T, S and C are constructed with embedding lags τT,  τS, and τC, respectively. The d𝒯-dimensional future states mathcalT^(d_mathcal T eta_mathcal T) are constructed with prediction lag η𝒯 (i.e. predictions go from present/past states to  future states spanning a maximum of d𝒯*η𝒯 time steps). Note: in Schreiber's paper, only the historical states are defined as  potentially higher-dimensional, while the future states are always scalar.\n\nEstimation\n\nTransfer entropy is here estimated by rewriting the above expressions as a sum of marginal  entropies, and extending the definitions above to use Rényi generalized entropies of order  q as\n\nTE^q(s to t) = H^q(mathcal T T) + H^q(T S) - H^q(T) - H^q(mathcal T T S)\n\nTE^q(s to t  c) = H^q(mathcal T T C) + H^q(T S C) - H^q(T C) - H^q(mathcal T T S C)\n\nwhere H^q(cdot) is the generalized Rényi entropy of order q. This is equivalent to the Rényi transfer entropy implementation in Jizba et al. (2012)[Jizba2012].\n\nExamples\n\nDefault estimation (scalar marginals): \n\n# Symbolic estimator, motifs of length 4, uniform delay vectors with lag 1\nest = SymbolicPermutation(m = 4, τ = 1) \n\nx, y = rand(100), rand(100)\ntransferentropy(x, y, est)\n\nIncreasing the dimensionality of the T marginal (present/past states of the target  variable):\n\n# Binning-based estimator\nest = VisitationFrequency(RectangularBinning(4)) \nx, y = rand(100), rand(100)\n\n# Uniform delay vectors when `τT` is an integer (see explanation above)\n# Here t_{i}^{(dT, τT)} = (t_i, t_{i+τ}, t_{i+2τ}, \\ldots t_{i+(dT-1)τ})\n# = (t_i, t_{i-2}, t_{i-4}, \\ldots t_{i-6τ}), so we need zero/negative values for `τT`.\ntransferentropy(x, y, est, dT = 4, τT = -2)\n\n# Non-uniform delay vectors when `τT` is a vector of integers\n# Here t_{i}^{(dT, τT)} = (t_i, t_{i+τ_{1}}, t_{i+τ_{2}}, \\ldots t_{i+τ_{dT}})\n# = (t_i, t_{i-7}, t_{i-25}), so we need zero/negative values for `τT`.\ntransferentropy(x, y, est, dT = 3, τT = [0, -7, -25])\n\nLogarithm bases and the order of the Rényi entropy can also be tuned:\n\nx, y = rand(100), rand(100)\nest = NaiveKernel(0.3)\ntransferentropy(x, y, est, base = MathConstants.e, q = 2) # TE in nats, order-2 Rényi entropy\n\n[Schreiber2000]: Schreiber, T. (2000). Measuring information transfer. Physical review letters, 85(2), 461.\n\n[Jizba2012]: Jizba, P., Kleinert, H., & Shefaat, M. (2012). Rényi’s information transfer between financial time series. Physica A: Statistical Mechanics and its Applications, 391(10), 2971-2989.\n\n\n\n\n\n","category":"function"}]
}
